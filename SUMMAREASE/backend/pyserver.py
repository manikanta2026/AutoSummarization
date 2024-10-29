from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz  # PyMuPDF for PDF extraction
from openai import OpenAI
from convert import markdown_to_html
from convert1 import markdown_to_html1
app = Flask(__name__)
CORS(app)

# OpenAI client setup (using NVIDIA API in your case)
client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key="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"
)

# Function to extract text from PDF
def extract_text_from_pdf(pdf_file):
    doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
    text = ""
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        text += page.get_text()
    return text

# Function to generate summary only via the API based on summary level
def generate_summary(text, summary_type):
    if summary_type == "small":
        prompt = (
            "Please generate a concise summary (small length) and return your response in bullet points"
            "based on the following content:\n\n"
            f"{text}"
        )
    elif summary_type == "medium":
        prompt = (
            "Please generate a medium-length summary (medium length) return your response in bullet points"
            "based on the following content:\n\n" 
            f"{text}"
        )
    else:  # large
        prompt = (
            "Please generate a very detailed summary (large length) covering all content return your response in bullet points"
            "based on the following content:\n\n"
            f"{text}"
        )

    completion = client.chat.completions.create(
        model="meta/llama-3.1-405b-instruct",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
        top_p=0.7,
        max_tokens=1024,
        stream=True
    )

    result = ""
    for chunk in completion:
        if chunk.choices[0].delta.content is not None:
            result += chunk.choices[0].delta.content
    return result

# Function to generate Q&A only via the API
def generate_qa(text):
    prompt = (
    '''Please generate some possible question and answer pairs based on the following content. Format each Q&A pair like bulletpoints and leave space for each pair
'''
    f"{text}"
)


    completion = client.chat.completions.create(
        model="meta/llama-3.1-405b-instruct",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
        top_p=0.7,
        max_tokens=1024,
        stream=True
    )

    result = ""
    result1 = ""
    for chunk in completion:
        if chunk.choices[0].delta.content is not None:
            result += chunk.choices[0].delta.content
    return result

@app.route('/summary', methods=['POST'])
def summarize_pdf():
    file = request.files.get('file')
    summary_type = request.form.get('summary_type', 'small')  # Default to "small"
    
    if not file:
        return jsonify({"error": "No file provided"}), 400
    
    # Extract text from the PDF
    pdf_text = extract_text_from_pdf(file)
    if not pdf_text:
        return jsonify({"error": "Failed to extract text from the PDF"}), 500
    
    # Use API to generate summary
    result = generate_summary(pdf_text, summary_type)
    print(result)
    
    return jsonify({"summary": markdown_to_html(result)})

@app.route('/qa', methods=['POST'])
def generate_qa_pdf():
    file = request.files.get('file')
    
    if not file:
        return jsonify({"error": "No file provided"}), 400
    
    # Extract text from the PDF
    pdf_text = extract_text_from_pdf(file)
    if not pdf_text:
        return jsonify({"error": "Failed to extract text from the PDF"}), 500
    
    # Use API to generate Q&A pairs
    result1 = generate_qa(pdf_text)
    print(result1)
    return jsonify({"qa": markdown_to_html1(result1)})

if __name__ == '__main__':
    app.run(debug=True)
