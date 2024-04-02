> ⚠️ **_NOTE:_**  This project is no longer being maintained. Please feel free to fork it, clone it, make your own version of it, or whatever you wish.



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

 1. Extract the contents of the ZIP file to /sbbs/xtrn/sixelgallery
 
 2. Download and install ImageMagick from: https://imagemagick.org
 
 3. In your favorite text editor, open settings.ini and edit the value
    of `path_to_im_conv` to the path where ImageMagick is installed on your 
    system, including the "convert" executable itself.

    `path_to_im_conv = c:\imagemagick\convert.exe`
    
 5. Add as many paths as you want to have menu options in the the paths.json file.
 
    Examples:
    ```
    [
       {
          "name": "Some homemade food",
          "path": "c:\\files\\images\\food",
          "cleanup_zip_subdirs": false,
          "resize": true
       },
       {
          "name": "GIFs Galore CD-ROM",
          "path": "c:\\files\\gifgalor\\GIFS",
          "cleanup_zip_subdirs": false,
          "resize": true
       },
       {
          "name": "fsxNet Images",
          "path": "c:\\files\\fsxnet_imge",
          "cleanup_zip_subdirs": true,
          "resize": true
       }
    ]
    ```
             
    The `cleanup_zip_subdirs` option removes subdirectories created as 
    a result of browsing ZIP files.

    The `resize` option controls whether to have ImageMagick resize the
    image to the dimensions specified in settings.ini.
   
    
 7. Add to SCFG -> External Programs-> Online Programs (Doors):

    ```
    Name                  Sixel Gallery
    Internal Code         SIXELGAL
    Start-up Directory    ../xtrn/sixelgallery
    Command Line          ?sixelgallery
    ```

 8. Add to File Options -> Viewable Files: 

    ```
    GIF   ?../xtrn/sixelgallery/sixelgallery.js %f
    JPG   ?../xtrn/sixelgallery/sixelgallery.js %f
    PNG   ?../xtrn/sixelgallery/sixelgallery.js %f
    ```

    
    
    If you have `?archive list %f` configured for * (libarchive), make sure 
    you include the above image types BEFORE it.
       
       

## Configuration and Customization:

 Edit the included sixelgallery.msg file to your liking in PabloDraw.
 
 The `scale_max_width` and `scale_max_height` settings were 
 decided on somewhat arbitrarily, but they can be changed. I found 
 that images of this size filled the screen of a typical 80x24 SyncTERM 
 console nicely.
 
 If you don't wish to auto-scale your images in the terminal, you can set
 the `resize` setting to false in your paths.json file, and ImageMagick will 
 not resize the resulting image. However, they will likely end up being too 
 large to view all at once. 
 
 The difference between `resize` in paths.json and `scale` in settings.ini:

 * `resize` in paths.json controls the resizing of the resulting sixel image on a per-path basis, and is enforced when calling sixelgallery.js as an external program.
 * `scale` in settings.ini also controls the resizing of the resulting sixel image, but it's enforced only when calling sixelgallery.js on individual image files, such as those specified for viewable files in your file area (see 'How it works' and 'Instructions' sections above). You will usually want to leave this set to `true`. 



## Other Notes
 
 If the input image has multiple frames of animation (e.g. an animated GIF),
 ImageMagick produces multiple output frames of the input image. Sixelgallery
 then outputs each sixel image to the terminal.

 ![SyncTERM - ConstructiveChaos BBS      ssh 2023-07-24 15-31-51](https://github.com/codefenix-ConChaos/SixelGallery/assets/12660452/285b06d0-e599-4fce-b8cd-99029d4321ca)

 Small images work best; dimensions of around 200x200 or less are recommended.
 It's also recommended to set `resize` to false for any paths containing 
 many animation files.
 
 
