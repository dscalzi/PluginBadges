const REGEX_DEVBUKKIT = /dev.bukkit.org\/projects\/([^/]+)/;
const REGEX_SPIGOT = /spigotmc.org\/resources\/([^/]+)/;
const REGEX_ORE = /ore.spongepowered.org\/[^/]+\/([^/]+).*?/;
const REGEX_GITHUB = /github.com\/([^/]+\/[^/]+)/;

function calcVal(match, key){
    return (match != null) ? '&' + key + '=' + encodeURIComponent(match[1]) : '';
}

function buildQueryString(){
    var q = '';

    q += calcVal(document.getElementById('input_bukkit').value.match(REGEX_DEVBUKKIT), 'bukkit');
    q += calcVal(document.getElementById('input_spigot').value.match(REGEX_SPIGOT), 'spigot');
    q += calcVal(document.getElementById('input_ore').value.match(REGEX_ORE), 'ore');
    q += calcVal(document.getElementById('input_github').value.match(REGEX_GITHUB), 'github');
    q += '&style=' + document.getElementById('input_style').value;

    if(q.length > 0){
        q = '?' + q.substring(1, q.length);
    }

    return q.length > 1 ? q : '';
}

function buildFullUrl(){
    return 'https://pluginbadges.glitch.me/api/v1/dl/' + encodeURIComponent(document.getElementById('input_badge_name').value) + '-' + (encodeURIComponent(document.getElementById('input_color').value) || 'limegreen') + '.svg' + buildQueryString();
}

$(function(){

    document.getElementById('button_clear').onclick = e => {
        var el = null;
        for(el of document.getElementsByClassName('cl_val')){
            el.value = '';
        }
        for(el of document.getElementsByClassName('cl_sel')){
            el.selectedIndex = 0;
        }
    };

    document.getElementById('button_submit').onclick = e => {
        const url = buildFullUrl();
        document.getElementById('output_link').value = url;
        document.getElementById('img_preview').src = url;
    };

    document.addEventListener('keydown', (e) => {
        if(e.key === 'Enter'){
            document.getElementById('button_submit').click();
        }
    });

});

