# ![BRICKS](/assets/icons/png/64x64.png) BROWSER BRICKS

這是一個 [Electron APP](http://electron.atom.io/) 的練習，學習如何使用 `webview` tag 的功能

可以想像成他是一個 `Chrome Browser` (`Electron APP` 基底是使用 `Chromium`)，但是裡面不再是分頁(tab)的顯示方式，我設計成可以動態產生 `webview`，再利用 `css grid` 的排版，當開啟的 `web view` 多，看起來像是一面網頁磚牆

還在煩惱每次要同時看好幾個直播，要開好幾個視窗，還要搞定每個視窗的位置和大小嗎?

- 我現在都這樣看直播的
![usage-1](/demo/usage-1.PNG)

- 也可以利用 `youtube` 播放器全螢幕功能
![usage-2](/demo/usage-2.PNG)

你就把這些磚當作平常用的分頁(tab)，想開多少就開多少，還可以配合原有 ctrl + 點連結的另開新分頁方式，現在會另開新的磚給你

嫌磚太小?

- 2 x n
![usage-3](/demo/usage-3.PNG)

- 1 x n (half height)
![usage-4](/demo/usage-4.PNG)

- 2 x n (full height)
![usage-5](/demo/usage-5.PNG)

- 1 x n (full height)
![usage-6](/demo/usage-6.PNG)

- 概觀
  - 左邊這塊磚是一般 web view，磚裡左上角會有一排瀏覽器基本功能
  - 右邊這塊很多 icon 的磚是 dashboard，左到右上到下分別是 `新增 webview`、`匯入/出`、`切換磚形`、`全磚聲音開關`、`移除所有磚` 和 `重新整理所有磚(或每隔一段時間重新整理)`
![overview](/demo/overview.PNG)

切換分頁(tab)的區塊這麼小，當分頁一多，真的有人能一次就切換到自己想要看的分頁嗎?

> 目前是第一版(20180211)，請多多指教

> 若你是純粹想玩、不碰程式碼的人，可以下載
[BROWSERBRICKS_release_large](https://app.box.com/s/yncz7ehaas7llt5s2nfig5hjjugknybi) (解壓縮後即可點擊 .exe 使用)

> 若你的電腦有安裝 `npm`，可以下載 [BROWSERBRICKS_release](https://app.box.com/s/8rnoaufh652n0vax3pf96ky1791uj914) 
並在第一次開啟程式前，開啟 command line 輸入以下指令，他在 `global 層級` 安裝 `electron` (假如你已經安裝過省略此步驟):

```
npm install electron --global
```