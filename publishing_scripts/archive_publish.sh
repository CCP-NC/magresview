#!/bin/sh

# Folders or files to NOT archive
EXCLUDED_PATHS='publishing_scripts' 

echo "Archiving MagresView"

# Check if we're in the right directory
if ( [[ $PWD != *magresview ]] ) then
  echo "Impossible to publish from this directory; please run from the MagresView parent directory"
  exit
fi

# Version number
VSTRING=$1

if ( [[ $VSTRING == "" ]] ) then
  VSTRING="novers"
fi	

# Create two archives (.zip and .tar)
echo "Publishing as ZIP"
hg archive -X=$EXCLUDED_PATHS ../MagresView_$VSTRING.zip
echo "Publishing as TAR"
hg archive -X=$EXCLUDED_PATHS ../MagresView_$VSTRING.tar