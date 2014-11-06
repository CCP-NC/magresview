//MagresView 
//by Simone Sturniolo
//
//Copyright 2013 Science and Technology Facilities Council
//This software is distributed under the terms of the GNU General Public License (GNU GPL)
//Please refer to the file COPYING for the text of the license

// This file handles changes of state (interface, display, selection etc.) in a unified way. The previous way of doing this was lacking
// because it caused many repetitions of the same function calls. With this, we should avoid that

var global_state_machine;

function state_machine() {

    this.get_state = function() {

        tab_active = $("#main_tabs").tabs("option", "active");                  // Tab
        acc_active = $("#visual_accordion").accordion("option", "active");      // Accordion tab

        state = {

            accordion_tab: (tab_active == tab_index("#visual_accordion")),
            filegen_tab: (tab_active == tab_index("#file_gen")),
            align_tab: (tab_active == tab_index("#sys_align")),
            option_tab: (tab_active == tab_index("#options_accordion")),

            dip_accordion: (acc_active == 3),
            dip_check: $("#dipolar_check").prop("checked"),
            dip_sphere_check: $("#vvleck_sphere_check").prop("checked"),

            isc_accordion: (acc_active == 2),
            isc_check: $("isc_check").prop("checked"),

            file_sphere_check: $("#range_sphere_check").prop("checked"),
            file_not_recap: $("#file_type_drop").val() != "recap",                   //Is the JSON or the Tabulated file generation active?
            file_range: $("#sel_file_drop").val().indexOf("range") > -1,

        }


        return state;

    }

    this.current_state = this.get_state();    // Current state


    this.handle_change = function(change_of)
    {
        /* A wrapper function for everything else. change_of can be state, display, selection. In summary:
         * "state" is a global change in the interface of MagresView. For example, changing tab. This triggers all the others
         * "display" is a change in which atoms are displayed on screen. This is triggered by some visualization modes making
         use of ghost atoms like the dipolar/isc ones. This triggers a change in selection and in plot
         * "selection" is a change in which the selected atoms are altered. This triggers a change in plot

         */

         switch(change_of)
         {
            case "state":
                this.handle_state_change();
                break;
            case "display":
                this.handle_display_change();
                break;
            case "selection":
                this.handle_select_change();
                break;
            default:
                break;
         }

    }

    this.handle_state_change = function()
    {
        // Orders all the display changes required by a state change. Replaces the old sphere_handlers mostly.

        // Define the new state

        this.current_state = this.get_state();
        var current = this.current_state;       // Just an alias

        // Now we have a proper picture of the situation, so start building the resulting script

        state_change_script = "define default_displaygroup " + default_displaygroup + ";";
        display_group = "default_displaygroup";

        // First, the dipolar part

        // The dipolar sphere: it gets displayed only if we're on the dipolar tab and the corresponding box is checked, or if dipolar labels are on

        dip_sphere_script = "ellipsoid id dipolar_sphere_choice";

        if ( ( (current.accordion_tab && current.dip_accordion) || current.dip_check) && current.dip_sphere_check)
        {
            var r = parseFloat($("#vvleck_r").val());

            dip_sphere_script += " axes {" + r + " 0 0} {0 " + r + " 0} {0 0 " + r + "} center {*}[" + last_atom_picked + "] color translucent 0.7 {200 200 200};";
            display_group = display_group + " or within(" + r + ", ({*}[" + last_atom_picked + "]))";
        }
        else
        {
            dip_sphere_script += " delete;";
        }

        state_change_script += dip_sphere_script;

        // The isc ghost atoms

        isc_closest_script = "";

        if ((current.accordion_tab && current.isc_accordion) || current.isc_check)
        {
                var aexpr = '{*}[' + last_atom_picked + ']';

                isc_closest_script += "fx0=" + aexpr + ".fx; fy0=" + aexpr + ".fy; fz0=" + aexpr + ".fz;";
                isc_closest_script += "fxmin=fx0-0.5; fxmax=fx0+0.5;";
                isc_closest_script += "fymin=fy0-0.5; fymax=fy0+0.5;";
                isc_closest_script += "fzmin=fz0-0.5; fzmax=fz0+0.5;";
                display_group += " or {fx>fxmin and fx<=fxmax and fy>fymin and fy<=fymax and fz>fzmin and fz<=fzmax}";
        }

        state_change_script += isc_closest_script;

        // Finally, the file range sphere

        file_sphere_script = "ellipsoid range_sphere_choice";

        if (current.filegen_tab && current.file_not_recap && current.file_range && current.file_sphere_check)
        {
            var r = parseFloat($("#range_file_r").val());

            file_sphere_script += " axes {" + r + " 0 0} {0 " + r + " 0} {0 0 " + r + "} center {*}[" + last_atom_picked + "] color translucent 0.7 {200 200 200};";
            display_group += " or within(" + r + ", ({*}[" + last_atom_picked + "]))";

        }
        else
        {
            file_sphere_script += " delete;"
        }

        state_change_script += file_sphere_script;

        // Now build the complete script and run it

        state_change_script += "display " + display_group + ";";                                 // Display the proper atoms
        state_change_script += "color {displayed and not default_displaygroup} translucent;"     // Color 
        state_change_script += "message 'displayed_change';";                                    // Explicitly triggers the call to a display change

        // Now add the align script (another thing controlled purely by state)

        if (current.align_tab)
        {
            state_change_script += align_bind_script();
        }
        else
        {
            state_change_script += align_unbind_script();
        }

        Jmol.script(mainJmol, state_change_script);

        // Hiding download links when they're not needed/the output needs to be reset

        if(current.filegen_tab)                //Is the File generation tab active?
        {
            if(current_framework == "Java")
            {
                $("#file_download").addClass("hidden");
                $("#file_download").attr("href", "");
            }
        }
        else
        {
            $("#file_download").addClass("hidden");     
            $("#file_download").attr("href", "");
        }
        
        if(current.option_tab)               //Is the Options tab active?
        {
            if(current_framework == "Java")
            {
                $("#snap_download").addClass("hidden");
                $("#snap_download").attr("href", "");
            }
        }
        else
        {
            $("#snap_download").addClass("hidden");     
            $("#snap_download").attr("href", "");
        }

    }

    this.handle_display_change = function()
    {
        // Orders all the selection changes required by a display change. These are all handled by the sel_drop functions  

        sel_drop_handler(false);

    }

    this.handle_select_change = function()
    {
        //If the selected group has changed, wait for the new selection to take effect, and then update the plots
        //This is required in order to reset the maximum and minimum when replotting after a change of selection, or as a result the transparency scale will be wrong
        //(and potentially broken)
        $("#isc_min").attr("disabled", true);
        $("#isc_max").attr("disabled", true);

        // Here come the updates in plot
        plot_update();
        iso_drop_update();
        svg_spectrum_plot(true);
    }

}
