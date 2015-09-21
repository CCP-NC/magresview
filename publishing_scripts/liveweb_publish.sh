#!/bin/sh

# Publishing logfile name (avoid conflicts)
LOGFILE_NAME='publishing_logfile.txt'

# Folders or files to NOT copy
EXCLUDED_PATHS='examples|publishing_scripts'

echo "Publishing on CCPNC website"

# Check if we're in the right directory
if ( [[ $PWD != *magresview ]] ) then
  echo "Impossible to publish from this directory; please run from the MagresView parent directory"
  exit
fi

# Create a log file to remember what and when are we doing now, this will be uploaded but then deleted locally
echo "MagresView uploaded by" $(hostname) "on" $(date) > $LOGFILE_NAME

# Now copy EVERYTHING BUT the "examples" directory and this one
ls -1 | grep -v -E $EXCLUDED_PATHS | xargs -I{} scp -r {} ccpnc@webs.materials.ox.ac.uk:public_html/magresview/magresview

rm $LOGFILE_NAME