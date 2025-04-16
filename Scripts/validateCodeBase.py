import datetime
import os
import json

ingore_files = ["node_modules", ".git"]
hasToInclude = [".js", ".ts"]

def map_folder_to_json(folder_path):
    data = {}
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            add = True
            foundRequirement = False
            file_path = os.path.join(root, file)
            # Use relative paths for JSON structure
            relative_path = os.path.relpath(file_path, folder_path)
            for ingoreTest in ingore_files:
                if ingoreTest in relative_path:
                    add = False
            for includeTest in hasToInclude:
                if includeTest in relative_path:
                    foundRequirement = True
            if foundRequirement == False:
                add = False
            if add == True:
                data[relative_path] = {
                    "checked": False,
                    "result": None,
                }
    return data

def scanFile(file_path, jsonItem):
    global linesChecked
    with open(file_path, 'r') as f:
        errors = []
        lines = f.readlines()
        doneWithImports = False
        lineNumber = 0
        activeComment = False
        for line in lines:
            lineNumber+= 1
            linesChecked += 1
            if line.strip().startswith("```"):
                activeComment = not activeComment
                continue
            if activeComment == True:
                continue
            if doneWithImports == True:
                if line.strip().startswith("import"):
                    errors.append(f"Error in {file_path} at line {lineNumber}: imports should be at the top")
                else:
                    continue
            if line.strip().startswith("import") or line.strip() == "" or line.strip().startswith("//"):
                if line.startswith("import"):
                    if ("./" in line or ".\\" in line) and not (".ts" in line or ".tsx" in line):
                        errors.append(f"Error in {file_path} at line {lineNumber}: No .ts found in import")
            else:
                doneWithImports = True
        if len(errors) > 0:
            jsonItem["result"] = {
                "failed": True,
                "errors": errors
            }
            jsonItem["checked"] = True
        else:
            jsonItem["result"] = {
                "failed": False
            }
            jsonItem["checked"] = True

def save_to_json(data, output_file):
    with open(output_file, 'w') as f:
        json.dump(data, f, indent=4)

if __name__ == "__main__":
    folder_path = "./"
    output_file = "Scripts/Results.json"
    
    folder_data = map_folder_to_json(folder_path)

    filesScanned = 0
    filesScannedFails = 0
    filesScannedWins = 0
    willRemove = []
    linesChecked = 0
    for file_path in folder_data.keys():
        filesScanned += 1
        scanFile(file_path, folder_data[file_path])
        if folder_data[file_path]["checked"] == True and folder_data[file_path]["result"]["failed"] == False:
            willRemove.append(file_path)
            filesScannedWins += 1
        else:
            filesScannedFails += 1

    for file_path in willRemove:
        del folder_data[file_path]
    
    finalJson = {
        "CheckDate": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "Errors": folder_data,
        "ScanLog": {
            "totalFiles": filesScanned,
            "passedFiles": filesScannedWins,
            "failedFiles": filesScannedFails,
            "linesChecked": linesChecked
        }
    }


    save_to_json(finalJson, output_file)
    print(f"Folder mapped successfully to {output_file}")
