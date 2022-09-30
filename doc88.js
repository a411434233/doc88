// https://www.doc88.com/p-9089138532915.html?s=like&id=4


const puppeteer = require('puppeteer')
const readline = require("readline")

// 创建readline接口实例
let r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})


async function dowon(url) {

    try {
        const browser = await puppeteer.launch({
            headless: false,
        })

        const page = await browser.newPage()

        await page.goto(url, {
            waitUntil: 'networkidle2'
        })

        await page.evaluate(async () => {
            let showAllBtn = document.getElementById('continueButton')
            const imagesArr = []
            if (showAllBtn) {
                showAllBtn.click()
            }

            // 下一条
            const nextPageButton = document.getElementById('nextPageButton')


            //获取总条数
            const pagelenth = document.querySelectorAll('.outer_page').length

            function awaitTime(time = 300) {
                return new Promise(resolve => {
                    setTimeout(() => {
                        resolve()
                    }, time)
                })
            }

            async function getImages(max, isNow, doc, nextPageButton, imagesArr) {

                if (isNow > max) return Promise.resolve()

                const pageCanvas = doc.getElementById('page_' + isNow)

                if (pageCanvas === null || pageCanvas.height <= 300) {
                    await awaitTime(300)
                    return await getImages(max, isNow, doc, nextPageButton, imagesArr)
                }

                const pageNo = isNow
                pageCanvas.toBlob(
                    blob => {
                        const anchor = doc.createElement('a')
                        anchor.download = 'page_' + pageNo + '.png'
                        anchor.href = URL.createObjectURL(blob)
                        anchor.click()
                        URL.revokeObjectURL(anchor.href)
                    }
                )

                // 执行下一条
                nextPageButton.click()
                await awaitTime(300)
                isNow = isNow + 1
                return await getImages(max, isNow, doc, nextPageButton, imagesArr)
            }

            await getImages(pagelenth, 1, document, nextPageButton, imagesArr)


            return imagesArr

        }).then(res => {
            page.close()
            console.log('下载已结束')
        })
        await new Promise((resolve, reject) => {
            console.log('3秒后自动关闭')
            setTimeout(() => {
                resolve()
            }, 3000)
        })
        await browser.close()
        process.exit()
    } catch (e) {
        console.log(e)
    }

}

//调用接口方法
r1.question("输入链接：", function (answer) {
    console.log(answer)
    dowon(answer)
    // r1.close()
})




