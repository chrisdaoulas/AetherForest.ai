import os

def delete_files(directory):
    # Iterate over all files in the directory
    for filename in os.listdir(directory):
        filepath = os.path.join(directory, filename)
        try:
            # Check if it's a file
            if os.path.isfile(filepath):
                os.remove(filepath)  # Delete the file
        except Exception as e:
            print(f"Failed to delete {filepath}. Reason: {e}")