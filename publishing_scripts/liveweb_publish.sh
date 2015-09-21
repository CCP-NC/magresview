#!/bin/sh

# Publishing logfile name (avoid conflicts)
LOGFILE_NAME='publishing_logfile.txt'

# Folders or files to NOT copy
EXCLUDED_PATHS='examples|publishing_scripts'

# External system details
USERSCP='ccpnc'
HOSTSCP='webs.materials.ox.ac.uk'
FOLDSCP='public_html/magresview/magresview'

echo "Publishing on CCPNC website"

# Check if we're in the right directory
if ( [[ $PWD != *magresview ]] ) then
  echo "Impossible to publish from this directory; please run from the MagresView parent directory"
  exit
fi

# Create a log file to remember what and when are we doing now, this will be uploaded but then deleted locally
echo "MagresView uploaded on" $(date) > $LOGFILE_NAME
if ( [[ $1 != "" ]] ) then
  echo $1 >> $LOGFILE_NAME
fi

# This wrapper is needed for copying multiple files
multi_scp () {
  dest=$USERSCP@$HOSTSCP:$FOLDSCP
  echo dest
  echo $1
}

# Now copy EVERYTHING BUT the "examples" directory and this one
ls -1 | grep -v -E $EXCLUDED_PATHS | xargs sh -c 'scp -r "$@" '$USERSCP@$HOSTSCP:$FOLDSCP

rm $LOGFILE_NAME