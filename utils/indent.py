#!/usr/bin/env python

import sys
import os

# states

T_SWITCH = 1
T_FUNCTION = 2
T_IF = 4
T_FOR = 8
T_STMT = 16
T_CLASS = 32
T_MULTI_COMMENT = 64
T_SINGLE_COMMENT = 128
T_CASE = 256

def indent_line (line, stack):
    indent_lvl = len(stack)
    return (indent_lvl * 4) * " " + line.strip()

def indent_comment_line(line, stack):
    """Line assumed stripped"""

    if line[0: 2] == "/*" or line[0:2] == "//":
        return indent_line(line, stack)
    else:
        return " " + indent_line(line, stack)

def process_line_stack(line, stack):
    """Process this line line-by-line, and update global stack. Return line-level stack.
    The line is assumed to be stripped"""

    if line.startswith("function"):
        state = T_FUNCTION
    elif line.startswith("switch"):
        state = T_SWITCH
    else:
        state = T_STMT

    lls = []

    if line.startswith("case") or line.startswith("default"):
        # case statements are treated slightly differently
        state = T_CASE
        if stack[-1][1] == T_CASE:
            stack.pop() # cannot nest case inside case, so this is the last case

        # keep it simple
        lls.append( (":", T_CASE) )
    else:
        for c in line:
            if c in ["(", "[", "{"]:
                lls.append( (c, state) )
            elif c in [")", "]", "}"] and len(lls) == 0:
                item = stack.pop()
                if item[1] == T_CASE:
                    # pop again to get the switch item
                    stack.pop()
            elif c in [")", "]", "}"]:
                item = lls.pop()
                if item[1] == T_CASE:
                    # pop again to get the switch item
                    stack.pop()

    return lls

# in this iteration, I am ignoring invalid PHP
# I assume all PHP is valid

def indent_php (fname):
    stack = []
    new_lines = []

    # order:
    # 1. there is a line-level stack, which collects for the line
    # if there is a line-level stack-miss, the top-level stack is used
    # if line-level stack is non-empty at the end of the line, contents are appended to the global stack

    blankline_count = 0

    with open(fname) as f:
        for i, line in enumerate(f):
            sline = line.strip()

            if len(sline) == 0:
                new_line = sline
                blankline_count += 1
                if blankline_count > 1:
                    # do not add the line
                    continue
            elif sline.startswith("/*") or sline.startswith("*") or sline.startswith("//"):
                blankline_count = 0
                # ignore all elements, indent at previous level
                new_line = indent_comment_line(sline, stack)
            else:
                blankline_count = 0
                lls = process_line_stack(sline, stack)
                new_line = indent_line(sline, stack)
                stack.extend(lls)

            new_lines.append(new_line)

    return new_lines

def write_new_contents (fname, lines):
    print "writing %d lines" % len(lines)
    tmp_fname = "/tmp/x.php"
    lines = [line + "\n" for line in lines]
    with open(tmp_fname, "w") as f:
        f.writelines(lines)

    os.remove(fname)
    os.rename(tmp_fname, fname)

def main ():
    fname = sys.argv[1]
    new_lines = indent_php(fname)
    write_new_contents(fname, new_lines)

if __name__ == "__main__":
    sys.exit(main())
