const REGEX_DEVBUKKIT = /dev.bukkit.org\/projects\/(.+)/;
const REGEX_SPIGOT = /spigotmc.org\/resources\/(.+)/;
const REGEX_ORE = /ore.spongepowered.org\/.+\/(.+)/;
const REGEX_GITHUB = /github.com\/(.+)\/(.+)/;

function calcVal(match, index, key){
    return (match != null && match.length > index) ? '&' + key + '=' + match[index] : '';
}

function buildQueryString(){
    var q = '';

    q += calcVal(document.getElementById('input_bukkit').value.match(REGEX_DEVBUKKIT), 1, 'bukkit');
    q += calcVal(document.getElementById('input_spigot').value.match(REGEX_SPIGOT), 1, 'spigot');
    q += calcVal(document.getElementById('input_ore').value.match(REGEX_ORE), 1, 'sponge');
    const match = document.getElementById('input_github').value.match(REGEX_GITHUB);
    q += calcVal(match, 1, 'ghuser');
    q += calcVal(match, 2, 'ghrepo');

    if(q.length > 0){
        q = '?' + q.substring(1, q.length);
    }

    return q.length > 1 ? q : '';
}

function buildFullUrl(){
    return 'https://pluginbadges.glitch.me/api/' + document.getElementById('input_name').value + '-' + document.getElementById('input_color').value + '.svg' + buildQueryString();
}

$(function(){

    document.getElementById('button_preview').onclick = e => {
        console.log(buildFullUrl());
    };

    document.getElementById('button_submit').onclick = e => {
        console.log(buildFullUrl());
    };

});

