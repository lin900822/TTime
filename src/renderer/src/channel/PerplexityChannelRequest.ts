import { isNull } from '../../../common/utils/validate'
import HttpMethodType from '../enums/HttpMethodTypeClassEnum'
import request from '../utils/requestNotHandle'
import R from '../../../common/class/R'
import AgentTranslateCallbackVo from '../../../common/class/AgentTranslateCallbackVo'
import TranslateServiceEnum from '../../../common/enums/TranslateServiceEnum'
import { commonError } from '../utils/RequestUtil'
import { AxiosPromise } from 'axios'

class PerplexityChannelRequest {
    static PERPLEXITY_API_KEY = ''   // 這裡填Perplexity Api Key
    static PERPLEXITY_SYSTEM_PROMPT = `
    你是一個專業的程式開發文檔閱讀助手，主要負責將User輸入的文字片段總結，儘量使用清晰明確且簡潔的中文解釋其中複雜的術語或可能的困難點
    1. 如果User輸入是文字片段，直接解釋整段的意思，如果有比較專業的術語，也附上簡短解釋(太常見的術語就不用，如LLM, PDF, json等等所有開發者都知道的)
    2. 如果User輸入是程式碼片段，直接解釋其中的含義與較複雜的語法
    3. 如果User輸入是指令，直接解釋每個參數代表的意義
    4. 如果只有一個單字，先列出幾個常見的翻譯，再解釋這個單字在程式開發中可能的含意
    請用純文本回覆
    以下是User的輸入：
    `

    /**
     * 翻译
     *
     * @param info 翻译信息
     */
    static apiTranslateByPerplexityRequest = async (info): Promise<AxiosPromise> => {
        if (info.languageType === 'auto') {
            info.languageType = ''
        }
        return request({
            baseURL: 'https://api.perplexity.ai/',
            url: 'chat/completions',
            method: HttpMethodType.POST,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${PerplexityChannelRequest.PERPLEXITY_API_KEY}`
            },
            data: {
                model: 'sonar-pro',
                messages: [
                    {
                        role: 'system',
                        content: PerplexityChannelRequest.PERPLEXITY_SYSTEM_PROMPT
                    },
                    {
                        role: 'user',
                        content: info.translateContent
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
    static apiTranslateByPerplexity = (info): void => {
        PerplexityChannelRequest.apiTranslateByPerplexityRequest(info).then(
            (data) => {
                window.api['agentApiTranslateCallback'](R.okD(new AgentTranslateCallbackVo(info, data)))
            },
            (err) => {
                window.api['agentApiTranslateCallback'](
                    R.errorD(new AgentTranslateCallbackVo(info, commonError(TranslateServiceEnum.PERPLEXITY, err)))
                )
            }
        )
    }
}

export { PerplexityChannelRequest }
