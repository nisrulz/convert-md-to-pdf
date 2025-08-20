# Convert Markdown to PDF

[Read blogpost](https://crushingcode.nisrulz.com/posts/how-to-convert-markdown-to-pdf/)

## Installation

Install [Puppeteer](https://github.com/puppeteer/puppeteer):

```sh
npm list -g | grep puppeteer || npm install -g puppeteer --no-shrinkwrap
```

Install [Grip](https://github.com/joeyespo/grip):

```sh
python3 -m venv venv
source venv/bin/activate 
pip3 install grip
```

## Convert Markdown to HTML

```sh
cat example_doc.md | grip - --export example_doc.html
```

## Render HTML to PDF

Pass the HTML file as cmdline argument before running the `renderToPdf.js` script.

```sh
node renderToPdf.js example_doc.html
```

## Bash Helpers

Drop these in your `~/.bashrc` or `~/.zshrc` file

### Open file bash function

```sh
# Single command to open a file in your OS
# Use as: openFile filename.extension
function openFile(){
    # Open the generated output file
    if [[ $(uname -s) == "Darwin" ]]; then
        # macOS
        open $1
    else
        # Linux
        xdg-open $1
    fi
}
```

### MD to HTML

```sh
# Convert Markdown to HTML
# Use as: convertMarkdownToHtml your_markdown_file.md
# Use as with open flag: convertMarkdownToHtml your_markdown_file.md --open
function convertMarkdownToHtml(){
    if [[ $1 == *".md"* ]]; then
        # Filename without extension
        local FILE_NAME=$(basename "$1" .md)
        local OUTPUT_FILE="$FILE_NAME.html"
        # Read the markdown file and then convert it to an HTML file
        cat $FILE_NAME.md | grip - --export $OUTPUT_FILE

        if [[ $2 == "--open" ]]; then
          # Open the generated output file
          openFile $OUTPUT_FILE
        fi
    else
        echo "Passed file is not of markdown type. Please pass a .md file"
    fi
}
```

## MD to PDF

```sh
# Convert Markdown to PDF
# Use as: convertMarkdownToPdf your_markdown_file.md
# Use as with open flag: convertMarkdownToPdf your_markdown_file.md --open
function convertMarkdownToPdf(){
    if [[ $1 == *".md"* ]]; then
        # Filename without extension
        local FILE_NAME=$(basename "$1" .md)
        local TEMP_FILE="$FILE_NAME.html"
        # Read the markdown file and then convert it to an HTML file
        cat $FILE_NAME.md | grip - --export $TEMP_FILE
        # Render HTML to PDF
        node renderToPdf.js $TEMP_FILE
        # Remove intermediate html file
        rm $TEMP_FILE

        if [[ $2 == "--open" ]]; then
          # Open the generated output file
          openFile $FILE_NAME.pdf
        fi
    else
        echo "Passed file is not of markdown type. Please pass a .md file"
    fi
}
```

## License

```txt
Copyright 2021 Nishant Srivastava

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
