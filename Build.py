#!/usr/bin/env python3
import os

partials = [
    '_base.html',
    '_login.html',
    '_signup.html',
    '_app-header.html',
    '_app-weight.html',
    '_app-main.html',
    '_app-symptoms-workout.html',
    '_app-insights.html',
    '_profile-panel.html',
    '_history-modal.html',
    '_footer.html'
]

output_file = 'index.html'

with open(output_file, 'w', encoding='utf-8') as outfile:
    for partial in partials:
        path = os.path.join('src', 'partials', partial)
        if os.path.exists(path):
            with open(path, 'r', encoding='utf-8') as infile:
                outfile.write(infile.read())
                outfile.write('\n')
        else:
            print(f"Warning: {path} not found")