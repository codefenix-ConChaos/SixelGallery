load('cterm_lib.js');
load("sbbsdefs.js");
load("filebrowser.js");

const PATH_TO_IM_CONV = "path_to_convert.exe";
const TEMP_SIXEL_PATH = "C:\\sbbs\\xtrn\\sixelgallery\\";
const NODE_NUM = bbs.node_num;

var MAX_WIDTH = "640";
var MAX_HEIGHT = "370";

var optionScale = true;

var paths = [
    
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
];

function convertImage(imgPath) {
    log(LOG_INFO, "viewing: '" + imgPath + "'");
    if (file_exists(imgPath)) {
        console.clear(false);
        print("Preparing, \1b\1h" + file_getname(imgPath) + " \1w\1hplease wait.\1n.\1k\1h..\1n.\1k\1h.\1w\1h!");
        if (!optionScale) {
            print("\1n\1k(scaling is disabled, so this may take a while)");
        }
        // Imagemagick usage:
        // convert input.gif output.sixel
        var tmpSixel = TEMP_SIXEL_PATH + "temp" + NODE_NUM + ".sixel";
        var cmd = PATH_TO_IM_CONV + " " + imgPath + " " + (optionScale === true ? ("-resize " + MAX_WIDTH + "x" + MAX_HEIGHT + " ") : "") + tmpSixel;
        var rslt = system.exec(cmd);
        if (rslt == 0) {
            console.clear(false);
            if (file_exists(tmpSixel)) {
                show_sixel(tmpSixel);
                file_remove(tmpSixel);
            }
            /* TODO...
            display individually produced frames, in case
            of animated GIF... i dunno... 
             */
            else {
                print("failed.");
                log(LOG_WARNING, "Couldn't convert: '" + imgPath + "'");
            }
        } else {
            print("failed.");
            log(LOG_WARNING, "Couldn't convert: '" + imgPath + "'; rslt: " + rslt);
        }
    }
}


function show_sixel(fn) { // borrowed from C.G. Learn's sixel.js ... Thank you and RIP
    var image = new File(fn);
    if (image.exists) {
        if (image.open("rb", true)) {
            var readlen = console.output_buffer_level + console.output_buffer_space;
            readlen /= 2;
            while (!image.eof) {
                var imagedata = image.read(readlen);
                while (console.output_buffer_space < imagedata.length) {
                    mswait(1);
                }
                console.write(imagedata);
            }
            image.close();
            return true;
        }
    }
    return false;
}

function browseFiles(path) {
    var fb = new FileBrowser({
        'path': path,
        'top': path,
        'colors': {
            'lfg': WHITE,
            'lbg': BG_CYAN
        },
        'hide': ["???CAT.GIF", "*.DAB", "*.DAT", "*.EXB", "*.IXB", "*.RAW",
            "*.htm*", "*.com", "*.exe", "*.BBS", "UTILITY", "*.DIZ", "FLI",
            "*.DIR", "*.ANS", "*.ASC", "*.XB", "*.PDF", "*.CN", "*.RIP",
            "*.MP*", "*.NFO"]
    });
    fb.on(
        "fileSelect",
        function (fn) {
        print("\1n\x010\1L");
        var ext = file_getext(fn);
        if (typeof ext != "undefined" && ext.toLowerCase() == ".zip") {
            var destDir = fn.replace(ext, "");
            if (!file_isdir(destDir)) {
                system.exec(system.exec_dir + 'unzip -o -qq "' + fn + '" -d "' + destDir + '"');
            }
            if (file_isdir(destDir)) {
                this.path = destDir;
            }
        } else if (ext.toLowerCase() == ".txt") {
            console.clear(false);
            console.printfile(fn);
            console.pause();
            console.clear();
        } else {
            convertImage(fn);
            console.pause();
            console.clear();
        }
    })
    fb.open();
    while (!js.terminated) {
        var userInput = console.inkey(K_NONE, 5).toUpperCase();
        if (userInput == "Q") {
            break;
        }
        fb.getcmd(userInput);
        fb.cycle();
    }
    fb.close();
    printf("\1n\x010\1L");
    console.clear();
    console.home();
}

function mainMenu() {
    var selection = "";
    while (bbs.online && selection !== "Q") {
        printf("\1n\x010\1L");
        console.home();
        console.printfile(TEMP_SIXEL_PATH + "sixelgallery.msg");
        s = 0;
        l = 0;
        while (s < paths.length) {
            if (s + 1 < paths.length) {
                console.gotoxy(2, 9 + l);
                printf("\1c\1h%2d\1k\1h)\1n %s\x010\1n", s + 1, paths[s][0]);
                console.gotoxy(41, 9 + l);
                printf("\1c\1h%2d\1k\1h)\1n %s\x010\1n", s + 2, paths[s + 1][0]);
                s = s + 2;
            } else {
                console.gotoxy(2, 9 + l);
                printf("\1c\1h%2d\1k\1h)\1n %s\x010\1n", s + 1, paths[s][0]);
                s = s + 1;
            }
            l = l + 1;
        }
        print("\1n\r\n");
        //printf(" \1c\1h S\1k\1h)\1n Toggle scaling: \1w\1h%s\r\n", (optionScale === true ? "On" : "Off"));
        printf("\r\n\1b. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\1n")
        print("\1n\r\n");
        //printf("\r\nSelect: \1h1\1n-\1h%d\1n, \1hS\1n or \1hQ\1n to quit\1h> ", paths.length);
        printf("\r\nSelect: \1h1\1n-\1h%d\1n or \1hQ\1n to quit\1h> ", paths.length);
        //selection = console.getkeys("QS", paths.length, K_UPPER);
        selection = console.getkeys("Q", paths.length, K_UPPER);
        if (selection === "") {
            selection = "Q";
            //} else if (selection === "S") {
            //    optionScale = optionScale === true ? false : true;
        } else if (!isNaN(selection) && selection !== "") {
            selection = parseInt(selection) - 1;
            // Delete old previously created ZIP directories...
            if (paths[selection][2] == true) {
                var df = directory(backslash(paths[selection][1]) + "*");
                for (var i = 0; i < df.length; i++) {
                    if (file_isdir(df[i])) {
                        var fs = directory(backslash(df[i]) + "*");
                        for (var j = 0; j < fs.length; j++) {
                            file_remove(fs[j]);
                        }
                        rmdir(df[i]);
                    }
                }
            }
            browseFiles(paths[selection][1]);
        }
    }
}
var filename = argv[0];

if (console.cterm_version >= 1189) {
    
    if (filename === "" || filename === undefined) {    
        mainMenu();
    } else {
        convertImage(filename);
        console.pause();
    }    
    
} else {
    print("\1y\1hTerminal not supported\1n... \1w\1h:(");
    print("\1nInstall \1b\1hSyncTERM\1n or \1cMagiTerm\1n and call back!");
    console.pause();
}
