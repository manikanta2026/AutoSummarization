import re

def markdown_to_html1(text):
    # Pattern to match the Q&A format
    pattern = r"•\s*Q:\s*(.*?)\s*A:\s*(.*?)(?=\n•\s*Q:|\Z)"
    
    # Find all matches
    matches = re.findall(pattern, text, re.DOTALL)
    
    # Construct HTML list items from matches
    html_output = "<ul>\n"
    for question, answer in matches:
        html_output += f"  <li><strong>Q:</strong> {question.strip()}<br><strong>A:</strong> {answer.strip()}</li>\n"
    html_output += "</ul>"

    return html_output
