# SixelGallery (sixelgallery.js)

by Craig Hendricks  
codefenix@conchaos.synchro.net  
 telnet://conchaos.synchro.net  
  https://conchaos.synchro.net  



## Description:

 This is a simple Javascript mod that lets your users view nearly any image
 on your BBS in sixel format in SyncTERM. 

![sixel_demo](https://github.com/codefenix-ConChaos/sixelgallery.js/assets/12660452/57abe75c-dbef-4f39-b6e0-7eb56b4b7fd7)

## How it works:
 
 It uses ImageMagick to perform on-the-fly conversion of any specified image
 file to a temporary file containing the resulting sixel data, which it then
 outputs to the terminal.
 
 It can be ran one of two ways:
 
   1) As an External Program, which when ran gives the user a menu of available
      galleries configured (like AnsiView.js), and lets the user browse lists
      of image files to view.
   
   2) As a Viewable File Type, so that users browsing directories in your file
      areas containing images (e.g.: GIFs Galore CD-ROM) can preview the image
      prior to or instead of downloading it.
 
 In either mode, the script first checks to ensure the user is using SyncTERM 
 or equivalent sixel capable terminal (cterm_version >= 1189). If this check 
 fails, the user is shown a brief message telling them the action they're
 performing can't be done, and stops.
 
 It has been tested in Windows 10 as well as versions as old as Vista.
 
 It has been tested with ImageMagick versions as old as 6.9.9-37 and as 
 recent as 7.1.0-38.
 
 Since ImageMagick also runs in Linux, this script should also run just fine
 in Synchronet for Linux, but I haven't tested it myself.
 
 

## Instructions:

 1. Extract the contents of the sixelgallery.zip to /sbbs/xtrn/sixelgallery
 
 2. Download and install ImageMagick from: https://imagemagick.org
 
 3. In your favorite text editor, open sixelgallery.js and edit the value
    of `PATH_TO_IM_CONV` to the path where ImageMagick is installed on your 
    system, including the "convert" executable itself. 
    
 4. Add as many paths as you want to have menu options in the the paths object.
         
    `[ "Menu name", "path_to_option",  clean_up_subdirectories ]`
    
    The clean_up_subdirectories option removes subdirectories created as 
    a result of browsing ZIP files. 
 
    Examples:
    ```
    [
        "Some homemade food",         // ....... Menu name 
        "c:\\files\\images\\food",    // ....... Path to directory
        false                         // ....... Clean up subdirectories
    ],
    [
        "GIFs Galore CD-ROM",         // ....... Menu name 
        "c:\\files\\gifgalor\\GIFS",  // ....... Path to directory
        false                         // ....... Clean up subdirectories
    ],
    [ 
        "fsxNet Images",              // ....... Menu name 
        "c:\\files\\fsxnet_imge",     // ....... Path to directory
        true                          // ....... Clean up subdirectories
    ]
    ```
   
    
 5. Add to SCFG -> External Programs-> Online Programs (Doors):

    ```
    Name                  Sixel Gallery
    Internal Code         SIXELGAL
    Start-up Directory    ../xtrn/sixelgallery
    Command Line          ?sixelgallery
    ```

 6. Add to File Options -> Viewable Files: 

    ```
    GIF   ?../xtrn/sixelgallery/sixelgallery.js %f
    JPG   ?../xtrn/sixelgallery/sixelgallery.js %f
    PNG   ?../xtrn/sixelgallery/sixelgallery.js %f
    ```
    
    If you have `?archive list %f` configured for * (libarchive), make sure 
    you include the above image types BEFORE it.
       
       

## Configuration and Customization:

 Edit the included sixelgallery.msg file to your liking in PabloDraw.
 
 The `MAX_WIDTH` and `MAX_HEIGHT` settings near the top of the script were 
 decided on somewhat arbitrarily. You can change them if you wish. I found 
 that images of this size filled the screen of a typical 80x24 SyncTERM 
 console nicely.
 
 If you don't wish to auto-scale your images in the terminal, you can set
 the optionScale variable to false, and ImageMagick will not scale down the
 resulting image. However, they will likely end up being too large to view
 all at once.



## Other Notes

 I was too lazy to make an INI file to hold the config options. Maybe I'll
 add that someday so that people don't have to modify the JS file.
 
 I thought it might be cool to add support for animations, such as animated
 GIF files, as evidenced by some of the comments in the code. Maybe an 
 enhancement for another day.
 
 
