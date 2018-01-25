const {
    webFrame
} = require('electron');
const ipc = require('electron').ipcRenderer;
const dialogs = require('dialogs')();
const Sortable = require('@shopify/draggable/lib/sortable').default;

webFrame.setZoomFactor(1);
addWebview('www.youtube.com');

ipc.on('urls', (event, urls) => {
    urls.forEach(url => addWebview(url));
});

const sortable = new Sortable(document.querySelector('.wrapper'), {
    draggable: '.wrapper-three-col .panel:not(.panel-template):not(.panel-dashboard)',
    handle: '.wrapper-three-col .panel:not(.panel-template):not(.panel-dashboard)',
    classes: {
        mirror: 'panel-mirror'
    }
});

$('.add').click(askForAddingWebview);
$('.import').click(() => requestToMain('import'));
$('.export').click(() => requestToMain('export', $(".webview").map((i, e) => $(e).attr('src')).get()));
$(".n-col").click(toggleWrapperViewStyle);
$('.reload-all').click(changeReloadSetting);

$('.wrapper').on('click', '.remove', removeWebview);
$('.wrapper').on('click', '.view-control', controlViewScreen);
$('.wrapper').on('click', '.nav-control', controlNavigation);

function toggleWrapperViewStyle() {
    const $full = $('.one-full-col');
    const $one = $('.one-col');
    const $two = $('.two-col');
    const $three = $('.three-col');
    const $wrapper = $('.wrapper');
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
}

function requestToMain(eventName, data) {
    if (data) {
        ipc.send(eventName, data);
    } else {
        ipc.send(eventName);
    }
}

function askForAddingWebview() {
    dialogs.prompt('url', 'www.youtube.com', (urls) => {
        if (urls) {
            urls.split(' ').forEach((url) => addWebview(url));
        }
    })
}

function changeReloadSetting() {
    const intervalID = $('#intervalID').val();
    clearInterval(intervalID);
    const $this = $(this);
    const $period = $('.period');
    $period.removeClass('period-on');
    dialogs.prompt('period (unit: sec, if reload once, no input and [ok])', '', (period_str) => {
        if (period_str !== undefined) {
            if (period_str) {
                $period.addClass('period-on');
                autoReload(period_str);
            } else {
                autoReload();
            }
        }
    })
}

function autoReload(period_str) {
    const $intervalHidden = $('#intervalID');

    if (period_str) {
        const period = parseInt(period_str) * 1000;
        var id = setInterval(reload, period)
        $intervalHidden.val(id);
    } else {
        reload();
    }
}


function reload() {
    const allWebViews = $('.panel:not(.panel-template) webview');
    $.each(allWebViews, (i, e) => {
        e.reload();
    });
}

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

function controlNavigation() {
    const $this = $(this);
    const $panel = $this.closest('.panel');
    const $webview = $panel.find('webview');
    const webviewDOM = $webview[0];
    if ($this.is('.reload')) {
        webviewDOM.reload();
    } else if ($this.is('.goback')) {
        webviewDOM.goBack();
    } else if ($this.is('.goforward')) {
        webviewDOM.goForward();
    }
}

function addWebview(url) {
    if (url) {
        const i = $('.panel:not(.panel-template):not(".panel-dashboard")').length;
        const webviewId = "webview-" + (i + 1);
        url = url.startsWith('http://') || url.startsWith('https://') ? url : 'http://'.concat(url);

        const $panel = $('.panel-template').clone().removeClass('panel-template');
        const $webview = $panel.find('webview');
        $webview
            .attr('id', webviewId)
            .attr('src', url);
        $panel.insertBefore('.panel-template');
    }
}