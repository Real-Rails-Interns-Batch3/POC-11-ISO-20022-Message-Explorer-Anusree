import os

with open('../repomix-output.xml', 'r', encoding='utf-8') as f:
    content = f.read()

files_to_extract = [
    'frontend/src/app/page.tsx',
    'frontend/src/components/ComparisonView.tsx',
    'frontend/src/components/GlossaryView.tsx',
    'frontend/src/components/Sidebar.tsx'
]

os.makedirs('../scratch', exist_ok=True)

for file_path in files_to_extract:
    start_tag = f'<file path="{file_path}">'
    end_tag = '</file>'
    
    start_idx = content.find(start_tag)
    if start_idx != -1:
        start_idx += len(start_tag)
        end_idx = content.find(end_tag, start_idx)
        if end_idx != -1:
            file_content = content[start_idx:end_idx].strip()
            out_name = '../scratch/' + os.path.basename(file_path)
            with open(out_name, 'w', encoding='utf-8') as out:
                out.write(file_content)
            print(f"Extracted {file_path}")
