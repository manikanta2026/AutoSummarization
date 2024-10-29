import re

def markdown_to_html(markdown_text):
    # Convert headers
    markdown_text = re.sub(r'(?m)^# (.*)$', r'<h1>\1</h1>', markdown_text)  # Convert '# ' to <h1>
    markdown_text = re.sub(r'(?m)^## (.*)$', r'<h2>\1</h2>', markdown_text)  # Convert '## ' to <h2>
    markdown_text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', markdown_text)
    # markdown_text = re.sub(r'Q(.*?)\n', r'<strong>\1</strong>', markdown_text)




    # Convert unordered list items
    markdown_text = re.sub(r'(?m)^\* (.*)$', r'<ul>\n<li>\1</li>\n</ul>', markdown_text)  # Convert '* ' to <ul><li>

    # Fix multiple unordered lists to be in a single list
    markdown_text = re.sub(r'</ul>\n<ul>', '', markdown_text)  # Merge adjacent <ul> tags

    # Convert sub-list items with '+ ' to <li>
    markdown_text = re.sub(r'(?m)^\s*\+ (.*)$', r'<li>\1</li>', markdown_text)

    return markdown_text

# Example usage
markdown_text = """
"""

html_output = markdown_to_html(markdown_text)
print(html_output)
