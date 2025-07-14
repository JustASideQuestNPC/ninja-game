# Python script to convert the compiled typescript into a copy-pasteable file for Khan Academy.
from pathlib import Path
from datetime import datetime

JS_PATH = './js_build/build_formatted.js'
BACKUP_JS_PATH = './js_build/build.js'
OUTFILE_PATH = 'ka-build.html'

# convert relative paths to absolute ones
root_path = Path(__file__).parent
JS_PATH = (root_path / JS_PATH).resolve()
if not JS_PATH.is_file():
    JS_PATH = (root_path / BACKUP_JS_PATH).resolve()
    print('main js path does not exist, reverting to backup');

OUTFILE_PATH = (root_path / OUTFILE_PATH).resolve()

# grab all the code to insert
print('loading new code...')
code_lines = None
with open(JS_PATH) as file:
    code_lines = file.readlines()

print('loading previous build...')
html_lines = None
with open(OUTFILE_PATH) as file:
    html_lines = file.readlines()

# get everything before the inserted code
print('removing old code...')
leading_lines = []
buffer = ''
while buffer != '<script type>(()=>{\n' and len(html_lines) > 0:
    buffer = html_lines.pop(0)
    # update build date
    if buffer.startswith('Build Date/Time:'):
        buffer = f'Build Date/Time: {datetime.today().strftime('%m/%d/%Y %H:%M:%S')}\n'
    leading_lines.append(buffer)

# consume and erase the old code
while len(html_lines) > 1 and html_lines[0] != '})();</script>\n':
    html_lines.pop(0)

print('writing new code...')
with open(OUTFILE_PATH, 'w') as file:
    file.write(''.join(leading_lines))
    file.write(''.join(code_lines) + '\n')
    file.write(''.join(html_lines))

print('build complete!')