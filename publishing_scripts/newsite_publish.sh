#!/bin/bash

# Folders or files to NOT archive
EXCLUDED_PATHS='publishing_scripts' 

# Requires to pass the folder where the ccpnc-site git is located as an
# argument

rm -rf $1/grav-admin/magresview/magresview
hg archive -X "$EXCLUDED_PATHS" $1/grav-admin/magresview/magresview