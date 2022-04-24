/*
 * @Author: your name
 * @Date: 2022-04-22 16:32:48
 * @LastEditTime: 2022-04-22 16:32:49
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /mac/vite/vite-dmeo/src/utils/api.js
 */
import { CreatAxios } from 'utils/request'


export function getListAPI () {
    return CreatAxios({
        url: '/',
        method: 'get',
    })
}
