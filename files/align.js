//MagresView 
//by Simone Sturniolo
//
//Copyright 2013 Science and Technology Facilities Council
//This software is distributed under the terms of the GNU General Public License (GNU GPL)
//Please refer to the file COPYING for the text of the license

//This file handles changes in visual alignment of the system

function align_radio_handler(evt)
{
    var align_init_script = 'unbind "left-click"; unbind "right-click"; unbind "left-down"; unbind "right-down";';

    var active = $("#main_tabs").tabs("option", "active");
    if($("#main_tabs ul>li a").eq(active).attr('href') == "#sys_align")
    {    
        var align_type = $('input[name="align_t"]:checked').val();
        
        switch (align_type) {
            case "bond":
                align_init_script += 'set disablePopupMenu TRUE; draw id align_circle_1 delete; draw id align_circle_2 delete; align_atom_1 = null; align_atom_2 = null; \
                                    bind "left-down" "if (_ATOM != ({})) {align_atom_1 = _ATOM; draw id align_circle_1 circle {_ATOM} mesh nofill color {0 200 200} diameter @{{_ATOM}.radius*2.5}; \
                                    if (align_atom_1 != null and align_atom_2 != null) {sys_centre = (\\{displayed\\}).xyz; xpoint = align_atom_2.xyz-align_atom_1.xyz+sys_centre; \
                                    rot_quat = quaternion(@sys_centre, @xpoint, \\{0 0 @\\{align_atom_2.z-align_atom_1.z\\}\\}); moveto 1 quaternion molecular @rot_quat;}}"; \
                                    bind "right-down" "if (_ATOM != ({})) {align_atom_2 = _ATOM; draw id align_circle_2 circle {_ATOM} mesh nofill color {0 200 200} diameter @{{_ATOM}.radius*2.5}; \
                                    if (align_atom_1 != null and align_atom_2 != null) {sys_centre = (\\{displayed\\}).xyz; xpoint = align_atom_2.xyz-align_atom_1.xyz+sys_centre; \
                                    rot_quat = quaternion(@sys_centre, @xpoint, \\{0 0 @\\{align_atom_2.z-align_atom_1.z\\}\\}); moveto 1 quaternion molecular @rot_quat;}}";';              
                break;            
            case "ms":
                align_init_script += 'set disablePopupMenu TRUE; draw id align_circle_1 delete; draw id align_circle_2 delete; align_atom_1 = null; align_atom_2 = null; \
                                    bind "left-down" "if (_ATOM != ({})) { draw id align_circle_1 circle {_ATOM} mesh nofill color {255 128 0} diameter @{{_ATOM}.radius*2.5}; \
                                    rot_quat = {_ATOM}.tensor(\\"ms\\", \\"quaternion\\"); moveto 1 quaternion molecular @rot_quat;}";';
                break;
            case "efg":
                align_init_script += 'set disablePopupMenu TRUE; draw id align_circle_1 delete; draw id align_circle_2 delete; align_atom_1 = null; align_atom_2 = null; \
                                    bind "left-down" "if (_ATOM != ({})) { draw id align_circle_1 circle {_ATOM} mesh nofill color {0 128 255} diameter @{{_ATOM}.radius*2.5}; \
                                    rot_quat = {_ATOM}.tensor(\\"efg\\", \\"quaternion\\"); moveto 1 quaternion molecular @rot_quat;}";';
                break;
        }
        
    }
    else
    {
       align_init_script += 'unbind; set disablePopupMenu FALSE; set picking measure; draw id align_circle_1 delete; draw id align_circle_2 delete;';
    }
    
    Jmol.script(mainJmol, align_init_script);    
}

// q_0 = quaternion(script(\\"show rotation\\")); new_x = align_atom_2.xyz - align_atom_1.xyz; old_x = (!q_0)%[1 0 0]; \
//                                    rot_axis = cross(new_x, old_x); alpha = angle(new_x, {0 0 0}, rot_axis, old_x); moveto 1 molecular {0 0 0} @rot_axis @alpha

