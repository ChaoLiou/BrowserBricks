const { webFrame } = require('electron');
const ipc = require('electron').ipcRenderer;
const dialogs = require('dialogs')();

webFrame.setZoomFactor(1);

$('.add').click(() => dialogs.prompt('url', 'www.youtube.com', (urls) => urls.split(' ').forEach((url) => addWebview(url))));
$('.import').click(() => ipc.send('import'));
$('.export').click(() => ipc.send('export', $(".webview").map((i, e) => $(e).attr('src')).get()));

function addWebview(url) {
    if (url) {
        const $wrapper = $('.wrapper');
        const i = $('.panel').length - 1;
        const webviewId = "webview-" + (i + 1);
        url = url.startsWith('http://') || url.startsWith('https://') ? url : 'http://'.concat(url);
        $('<div class="panel">' +
            '<div class="tools">' +
            '<div class="remove">' +
            '<i class="far fa-times-circle"></i>' +
            '</div>' +
            '<div class="expand view-control">' +
            '<i class="fas fa-expand"></i>' +
            '</div>' +
            '<div class="collapse view-control">' +
            '<i class="fas fa-compress"></i>' +
            '</div>' +
            '</div>' +
            '<webview id="' + webviewId + '" class="webview" src="' + url + '" allowpopups webpreferences="nodeIntegration=no,nativeWindowOpen=yes"></webview>' +
            '</div>')
            .insertBefore('.panel.last');
    }
}

$('.wrapper').on('click', '.remove', removeWebview);
$('.wrapper').on('click', '.view-control', controlViewScreen);

function removeWebview() {
    const $this = $(this).closest('.panel');
    $this.remove();
}

function controlViewScreen() {
    const $this = $(this);
    const $panel = $this.closest('.panel');

    $panel.find('.view-control').show();
    $this.hide();
    if ($panel.hasClass('panel-one-full-col')) {
        $panel.removeClass('panel-one-full-col');
    } else {
        $panel.addClass('panel-one-full-col');
    }
}

ipc.on('urls', (event, urls) => {
    urls.forEach(url => addWebview(url));
})

$(".n-col").click(() => {
    var $full = $('.one-full-col');
    var $one = $('.one-col');
    var $two = $('.two-col');
    var $three = $('.three-col');
    var $wrapper = $('.wrapper');
    if ($full.is(':visible')) {
        $full.hide();
        $three.show();
        $wrapper.removeClass('wrapper-one-full-col');
        $wrapper.addClass('wrapper-three-col');
    } else if ($one.is(':visible')) {
        $one.hide();
        $full.show();
        $wrapper.removeClass('wrapper-one-col');
        $wrapper.addClass('wrapper-one-full-col');
    } else if ($two.is(':visible')) {
        $two.hide();
        $one.show();
        $wrapper.removeClass('wrapper-two-col');
        $wrapper.addClass('wrapper-one-col');
    } else if ($three.is(':visible')) {
        $three.hide();
        $two.show();
        $wrapper.removeClass('wrapper-three-col');
        $wrapper.addClass('wrapper-two-col');
    }
})