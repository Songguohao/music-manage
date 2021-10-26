import { post, get } from './http'

// 判断管理员是否登陆成功
export const getLoginStatus = (params) => post(`admin/login/status`, params)

// 添加歌手
export const setSinger = (params) => post(`singer/add`, params)

// 查询歌手
export const getAllSinger = () => get(`singer/allSinger`)

// 根据歌手id查询歌手
export const getSinger = (id) => get(`singer/selectByPrimaryKey?id=${id}`)

// 更新歌手
export const updateSinger = (params) => post(`singer/update`, params)

// 删除歌手
export const delSinger = (id) => get(`singer/delete?id=${id}`)

// =============== 歌曲相关=================

// 查询歌单
export const getAllSong = () => get(`song/allSong`)

// 根据歌手id查询歌曲
export const songOfSingerId = (id) => get(`song/singer/detail?id=${id}`)

// 根据歌曲id查询歌曲
export const songOfSongId = (songId) => get(`song/detail?songId=${songId}`)

// 根据歌曲名字查询歌曲
export const songOfSongName = (songName) => get(`song/songName/detail?songName=${songName}`)

// 根据歌曲id查询歌曲简单信息
export const songVOOfSongId = (songId) => get(`song/detailVO?songId=${songId}`)

// 更新歌曲
export const updateSong = (params) => post(`song/update`, params)

// 删除歌曲
export const delSong = (id) => get(`song/delete?id=${id}`)

// =============== 歌单相关=================

// 添加歌单
export const setSongList = (params) => post(`songList/add`, params)

// 查询歌单
export const getAllSongList = () => get(`songList/allSongList`)

// 更新歌单
export const updateSongList = (params) => post(`songList/update`, params)

// 删除歌单
export const delSongList = (id) => get(`songList/delete?id=${id}`)

// =============== 歌单歌曲相关 =================

// 添加歌曲
export const setListSong = (params) => post(`listSong/add`, params)

// 删除歌曲
export const delListSong = (id) => get(`listSong/delete?id=${id}`)

// 查询歌曲
export const listSongDetail = (songListId) => get(`listSong/detail?songListId=${songListId}`)

// =============== 用户相关 =================

// 添加歌手
export const setConsumer = (params) => post(`consumer/add`, params)

// 查询歌手
export const getAllConsumer = () => get(`consumer/allConsumer`)

// 根据歌手id查询歌手
export const getConsumer = (id) => get(`consumer/selectByPrimaryKey?id=${id}`)

// 更新歌手
export const updateConsumer = (params) => post(`consumer/update`, params)

// 删除歌手
export const delConsumer = (id) => get(`consumer/delete?id=${id}`)
