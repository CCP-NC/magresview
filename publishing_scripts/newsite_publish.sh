#!/bin/bash

# Requires to pass the folder where the ccpnc-site git is located as an
# argument

rm -rf $1/grav-admin/magresview/magresview
hg archive $1/grav-admin/magresview/magresview