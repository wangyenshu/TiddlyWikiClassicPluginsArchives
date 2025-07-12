import json
from pathlib import Path
import sys

def generate_plugin_list_json():
    """
    Scans the current directory for .txt files, generates a JSON list,
    and saves the output to TiddlyWikiClassicPluginsArchives.txt.
    """
    
    # Define the base URL, the type, and the output filename
    BASE_URL = "https://github.com/wangyenshu/TiddlyWikiClassicPluginsArchives/blob/main/"
    ITEM_TYPE = "collection"
    OUTPUT_FILENAME = "TiddlyWikiClassicPluginsArchives.txt"
    
    data_list = []
    
    # Get the current working directory
    current_dir = Path.cwd()
    
    # Iterate over all .txt files in the current directory
    for file_path in current_dir.glob('*.txt'):
        
        # Ensure we are only processing files
        if file_path.is_file():
            
            # Skip the output file itself if it exists in the directory
            if file_path.name == OUTPUT_FILENAME:
                continue
                
            filename = file_path.name
            description = file_path.stem
            
            # Construct the URL
            url = BASE_URL + filename
            
            # Create the dictionary for the current file
            file_info = {
                "url": url,
                "description": description,
                "type": ITEM_TYPE
            }
            
            # Add the dictionary to the list
            data_list.append(file_info)

    # Convert the list to a JSON formatted string with indentation
    json_output = json.dumps(data_list, indent=4)
    
    # ---
    # Write the JSON output to the specified file
    # ---
    
    try:
        # Open the file in write mode ('w') and save the JSON string
        with open(OUTPUT_FILENAME, 'w', encoding='utf-8') as f:
            f.write(json_output)
        
        print(f"Successfully generated and saved JSON output to {OUTPUT_FILENAME}")
        
    except IOError as e:
        # Handle potential errors during file writing
        print(f"Error writing file {OUTPUT_FILENAME}: {e}", file=sys.stderr)

if __name__ == "__main__":
    generate_plugin_list_json()
