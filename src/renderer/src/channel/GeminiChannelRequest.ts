import { isNull } from '../../../common/utils/validate'
import HttpMethodType from '../enums/HttpMethodTypeClassEnum'
import request from '../utils/requestNotHandle'
import R from '../../../common/class/R'
import AgentTranslateCallbackVo from '../../../common/class/AgentTranslateCallbackVo'
import TranslateServiceEnum from '../../../common/enums/TranslateServiceEnum'
import { commonError } from '../utils/RequestUtil'
import { AxiosPromise } from 'axios'

class GeminiChannelRequest {
    static GEMINI_API_KEY = ''   // 這裡填Gemini Api Key
    static GEMINI_SYSTEM_PROMPT = `
    你是一個專業的程式開發文檔閱讀助手，主要負責將User輸入的文字片段翻譯與總結，儘量使用清晰明確且簡潔的中文解釋其中複雜的術語貨可能的困難點
    如果User輸入是程式碼片段，直接解釋其中的含義與較複雜的語法
    請用純文本回覆，不需使用Markdown等標記語言
    以下是User的輸入：
    `

    /**
     * 翻译
     *
     * @param info 翻译信息
     */
    static apiTranslateByGeminiRequest = async (info): Promise<AxiosPromise> => {
        if (info.languageType === 'auto') {
            info.languageType = ''
        }
        return request({
            baseURL: 'https://generativelanguage.googleapis.com/',
            url: 'v1beta/models/gemini-2.0-flash:generateContent',
            method: HttpMethodType.POST,
            headers: {
                'Content-Type': 'application/json'
            },
            params: {
                key: GeminiChannelRequest.GEMINI_API_KEY
            },
            data: {
                contents: [
                    {
                        parts: [
                            {
                                text: GeminiChannelRequest.GEMINI_SYSTEM_PROMPT + info.translateContent // 這裡要是一段字串
                            }
                        ]
                    }
                ]
            }
        })
    }

    /**
     * Bing翻译
     *
     * @param info 翻译信息
     */
    static apiTranslateByGemini = (info): void => {
        GeminiChannelRequest.apiTranslateByGeminiRequest(info).then(
            (data) => {
                window.api['agentApiTranslateCallback'](R.okD(new AgentTranslateCallbackVo(info, data)))
            },
            (err) => {
                window.api['agentApiTranslateCallback'](
                    R.errorD(new AgentTranslateCallbackVo(info, commonError(TranslateServiceEnum.GEMINI, err)))
                )
            }
        )
    }
}

export { GeminiChannelRequest }
