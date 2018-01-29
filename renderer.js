const {
    webFrame
} = require('electron');
const ipc = require('electron').ipcRenderer;
const dialogs = require('dialogs')();
const Sortable = require('@shopify/draggable/lib/sortable').default;
let sortable = {};

webFrame.setZoomFactor(1);
addWebview('www.youtube.com');

ipc.on('urls', (event, urls) => {
    urls.forEach(url => addWebview(url));
});

$('.add').click(askForAddingWebview);
$('.import').click(() => requestToMain('import'));
$('.export').click(() => requestToMain('export', $(".webview").map((i, e) => $(e).attr('src')).get()));
$(".n-col").click(toggleWrapperViewStyle);
$('.reload-all').click(changeReloadSetting);
$('.remove-all').click(askForRemoveAllPanels);
$('.settings').click(() => requestToMain('settings'));

$('.wrapper').on('click', '.remove', removeWebview);
$('.wrapper').on('click', '.view-control', controlViewScreen);
$('.wrapper').on('click', '.nav-control', controlNavigation);
$('.wrapper').on('click', '.move', movePanel);

function movePanel() {
    const selector = '.panel:not(.panel-dashboard)';
    const $panel = $(selector);
    if ($panel.hasClass('active')) {
        $panel.removeClass('active');
        sortable.destroy();
    } else {
        $panel.addClass('active');
        sortable = new Sortable($('.wrapper')[0], {
            draggable: selector,
            handle: selector,
            classes: {
                mirror: 'panel-mirror',
                appendTo: '.wrapper'
            }
        });
        sortable.on('drag:stop', () => {
            $panel.removeClass('active');
            sortable.destroy()
        });
    }
}

function toggleWrapperViewStyle() {
    const $this = $(this);
    $('.n-col').removeClass('active');
    $this.addClass('active');
    const $wrapper = $('.wrapper');
    $wrapper.removeClass('wrapper-one-full-col')
        .removeClass('wrapper-one-col')
        .removeClass('wrapper-two-col')
        .removeClass('wrapper-three-col');

    if ($this.is('.one-full-col')) {
        $wrapper.addClass('wrapper-one-full-col');
    } else if ($this.is('.one-col')) {
        $wrapper.addClass('wrapper-one-col');
    } else if ($this.is('.two-col')) {
        $wrapper.addClass('wrapper-two-col');
    } else if ($this.is('.three-col')) {
        $wrapper.addClass('wrapper-three-col');
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
    dialogs.prompt('open a view with your link.', 'www.youtube.com', (urls) => {
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
        console.log(e);
    });
}

function askForRemoveAllPanels() {
    dialogs.confirm('Do you want to remove all views?', (res) => {
        if (res) {
            removeAllPanels();
        }
    });
}

function removeAllPanels() {
    $('.panel:not(.panel-template):not(.panel-dashboard)').remove();
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