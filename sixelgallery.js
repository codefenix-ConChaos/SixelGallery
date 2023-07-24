load('cterm_lib.js');
load("sbbsdefs.js");
load("filebrowser.js");

const MENU_ITEM_FMT = "\x01c\x01h%2d\x01k\x01h)\x01n %s\x010\x01n";

function convertImage(imgPath) {
    log(LOG_INFO, "viewing: '" + imgPath + "'");
    if (file_exists(imgPath)) {
        console.clear(false);
        print("Preparing \x01b\x01h" + file_getname(imgPath) + " \x01w\x01hplease wait.\x01n.\x01k\x01h..\x01n.\x01k\x01h.\x01w\x01h!");
        if (!scale) {
            print("\r\n\x01n\x01k(scaling is disabled, so this may take a while)");
        }
        var tmpSixel = backslash(temp_sixel_path) + "temp" + bbs.node_num + "-%05d.sixel";
        var cmd = path_to_im_conv + " -coalesce " + imgPath + " " + (scale ? ("-resize " + scale_max_width + "x" + scale_max_height + " ") : "") + tmpSixel;
        var rslt = system.exec(cmd);
        console.clear(false);
        var frames = directory(backslash(temp_sixel_path) + "temp" + bbs.node_num + "*.sixel");
        if (frames.length > 0) {
            for (var f = 0; f < frames.length; f++) {                       
                console.home();
                show_sixel(frames[f]);
                file_remove(frames[f]);
            }
        } else {
            print("failed.");
            log(LOG_WARNING, "No output found for '" + imgPath + "'.");
        }
        if (rslt !== 0) {
            log(LOG_WARNING, "Convert for '" + imgPath + "' rslt: " + rslt);
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
            "*.DIR", "*.ANS", "*.ASC", "*.XB", "*.PDF", "*.CN", "*.RIP","*.MP3",
            "*.MP*", "*.NFO", "*.INI", "*.SDT", "*.SHA", "*.SHD", "*.SID"]
    });
    fb.on(
        "fileSelect",
        function (fn) {
        print("\x01n\x010\x01L");
        var ext = file_getext(fn);
        if (typeof ext != "undefined" && ext.toLowerCase() === ".zip") {
            var destDir = fn.replace(ext, "");
            if (!file_isdir(destDir)) {
                system.exec(system.exec_dir + 'unzip -o -qq "' + fn + '" -d "' + destDir + '"');
            }
            if (file_isdir(destDir)) {
                this.path = destDir;
            }
        } else if (ext.toLowerCase() === ".txt") {
            console.clear(false);
            console.printfile(fn);
            console.pause();
            console.clear();
        } else {
            convertImage(fn);
            console.pause();
            console.clear();
        }
    });
    fb.open();
    while (!js.terminated) {
        var userInput = console.inkey(K_NONE, 5).toUpperCase();
        if (userInput === "Q") {
            break;
        }
        fb.getcmd(userInput);
        fb.cycle();
    }
    fb.close();
    printf("\x01n\x010\x01L");
    console.clear();
    console.home();
}

function mainMenu() {
    var selection = "";
    var jsonPaths = "";
    var fPaths = new File(js.startup_dir + "paths.json");
    if (fPaths.open("r")) {
        jsonPaths = JSON.parse(fPaths.read());
        fPaths.close();
        while (bbs.online && selection !== "Q") {
            printf("\x01n\x010\x01L");
            console.home();
            console.printfile(js.startup_dir + "sixelgallery.msg", P_NOABORT);
            s = 0;
            l = 0;
            while (s < Object.keys(jsonPaths).length) {
                if (s + 1 < Object.keys(jsonPaths).length) {
                    console.gotoxy(2, 9 + l);
                    printf(MENU_ITEM_FMT, s + 1, jsonPaths[s].name);
                    console.gotoxy(41, 9 + l);
                    printf(MENU_ITEM_FMT, s + 2, jsonPaths[s + 1].name);
                    s = s + 2;
                } else {
                    console.gotoxy(2, 9 + l);
                    printf(MENU_ITEM_FMT, s + 1, jsonPaths[s].name);
                    s = s + 1;
                }
                l = l + 1;
            }
            print("\x01n\r\n");
            printf(" \x01c\x01h S\x01k\x01h)\x01n Toggle scaling: \x01w\x01h%s\r\n", (scale ? "On" : "Off"));
            printf("\r\n\x01b. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\x01n");
            print("\x01n\r\n");
            printf("\r\nSelect: \x01h1\x01n-\x01h%d\x01n, \x01hS\x01n, or \x01hQ\x01n to quit\x01h> ", Object.keys(jsonPaths).length);
            selection = console.getkeys("QS", Object.keys(jsonPaths).length, K_UPPER);
            if (selection === "") {
                selection = "Q";
            } else if (selection === "S") {
                scale = scale ? false : true;
            } else if (!isNaN(selection) && selection !== "") {
                selection = parseInt(selection) - 1;
                if (jsonPaths[selection].cleanup_zip_subdirs) {
                    var df = directory(backslash(jsonPaths[selection].path) + "*");
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
                browseFiles(jsonPaths[selection].path);
            }
        }
    }
}

var fIni = new File(js.exec_dir + 'settings.ini');
fIni.open('r');
const settings = { root: fIni.iniGetObject() };
fIni.close();
fIni = undefined;
var path_to_im_conv = settings.root.path_to_im_conv;
var temp_sixel_path = settings.root.temp_sixel_path;
var scale = settings.root.scale;
var scale_max_width = settings.root.scale_max_width;
var scale_max_height = settings.root.scale_max_height;

var filename = argv[0];

if (console.cterm_version >= 1189) {
    if (filename === "" || filename === undefined) {
        mainMenu();
    } else {
        convertImage(filename);
    }
} else {
    print("\x01y\x01hTerminal not supported\x01n... \x01w\x01h:(");
    print("\x01nInstall \x01b\x01hSyncTERM\x01n or \x01cMagiTerm\x01n and call back!");
    console.pause();
}
