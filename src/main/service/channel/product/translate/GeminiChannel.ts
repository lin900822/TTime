import ITranslateAgentInterface from './ITranslateAgentInterface'
import log from '../../../../utils/log'
import GlobalWin from '../../../GlobalWin'
import R from '../../../../../common/class/R'
import TranslateChannelFactory from '../../factory/TranslateChannelFactory'
import TranslateAgent from './TranslateAgent'

class GeminiChannel extends TranslateAgent implements ITranslateAgentInterface {
    /**
     * 翻译
     *
     * @param res 信息
     */
    apiTranslateCallback(res: R): void {
        const dataObj = res.data
        const data = dataObj['response']
        const info = dataObj['request']

        const reply =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '⚠️ 無法取得回覆'

        log.info('[Gemini翻译事件] - 响应报文 : ', reply)

        if (res.code === R.ERROR) {
            log.info('[Gemini翻译事件] - 响应报文 : ', JSON.stringify(data))
            GlobalWin.mainWinSend(TranslateChannelFactory.callbackName(info.type), R.okIT(info, data))
            return
        }
        GlobalWin.mainWinSend(
            TranslateChannelFactory.callbackName(info.type),
            R.okIT(info, reply)
        )
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
    apiTranslateCheckCallback(_res): void { }
}

export default GeminiChannel
