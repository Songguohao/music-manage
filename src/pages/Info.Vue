<!--后台首页-->
<template>
  <div>
    <Row :gutter="20" class="mgb20">
      <Col :span="6">
        <Card>
          <div class="grid-content">
            <div class="grid-num">{{consumerCount}}</div>
            <div>用户总数</div>
          </div>
        </Card>
      </Col>
      <Col :span="6">
        <Card>
          <div class="grid-content">
            <div class="grid-num">{{songCount}}</div>
            <div>歌曲总数</div>
          </div>
        </Card>
      </Col>
      <Col :span="6">
        <Card>
          <div class="grid-content">
            <div class="grid-num">{{singerCount}}</div>
            <div>歌手总数</div>
          </div>
        </Card>
      </Col>
      <Col :span="6">
        <Card>
          <div class="grid-content">
            <div class="grid-num">{{songListCount}}</div>
            <div>歌单总数</div>
          </div>
        </Card>
      </Col>
    </Row>
    <Row :gutter="20" class="mgb20">
      <Col span="12">
        <h3 class="mgb20">用户性别比例</h3>
        <div style="background-color:white">
          <ve-pie :data="consumerSex" :theme='options'>
          </ve-pie>
        </div>
      </Col>
      <Col span="12">
        <h3 class="mgb20">歌曲风格分布</h3>
        <div style="background-color:white">
          <ve-histogram :data="songStyle">
          </ve-histogram>
        </div>
      </Col>
    </Row>
    <Row :gutter="20" class="mgb20">
      <Col span="12">
        <h3 class="mgb20">歌手性别比例</h3>
        <div style="background-color:white">
          <ve-pie :data="singerSex">
          </ve-pie>
        </div>
      </Col>
        <Col span="12">
        <h3 class="mgb20">歌手地区分布</h3>
        <div style="background-color:white">
          <ve-histogram :data="country" :theme='options1'>
          </ve-histogram>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
import { getAllConsumer, getAllSinger, getAllSong, getAllSongList } from '../api/index.js'
export default {
  name: 'Info',
  data () {
    return {
      consumerCount: 0,
      songCount: 0,
      singerCount: 0,
      songListCount: 0,
      consumer: [],
      song: [],
      singer: [],
      songList: [],
      consumerSex: { // 按性别分类的用户数
        columns: ['性别', '总数'],
        rows: [
          {'性别': '男', '总数': 0},
          {'性别': '女', '总数': 0}
        ]
      },
      options: {
        color: ['#87cefa', '#ffc0cb']
      },
      options1: {
        color: ['#5FB6F2']
      },
      songStyle: { // 按歌单的风格进行分类
        columns: ['风格', '总数'],
        rows: [
          {'风格': '华语', '总数': 0},
          {'风格': '粤语', '总数': 0},
          {'风格': '欧美', '总数': 0},
          {'风格': '日韩', '总数': 0},
          {'风格': '轻音乐', '总数': 0},
          {'风格': '二次元', '总数': 0},
          {'风格': '乐器', '总数': 0},
          {'风格': '摇滚', '总数': 0}
        ]
      },
      singerSex: { // 按性别分类的歌手
        columns: ['性别', '总数'],
        rows: [
          {'性别': '男', '总数': 0},
          {'性别': '女', '总数': 0},
          {'性别': '组合', '总数': 0},
          {'性别': '不明', '总数': 0}
        ]
      },
      country: { // 按地区划分
        columns: ['国籍', '总数'],
        rows: [
          {'国籍': '中国', '总数': 0},
          {'国籍': '日本', '总数': 0},
          {'国籍': '韩国', '总数': 0},
          {'国籍': '香港', '总数': 0},
          {'国籍': '台湾', '总数': 0},
          {'国籍': '英国', '总数': 0},
          {'国籍': '美国', '总数': 0},
          {'国籍': '未知', '总数': 0}
        ]
      }
    }
  },
  created () {
  },
  mounted () {
    this.getConsumer()
    this.getSong()
    this.getSinger()
    this.getSongList()
  },
  methods: {
    getConsumer () {
      getAllConsumer().then(res => {
        this.consumer = res.data
        this.consumerCount = res.data.length
        this.consumerSex.rows[0]['总数'] = this.setSex(1, this.consumer) // 男生数量
        this.consumerSex.rows[1]['总数'] = this.setSex(0, this.consumer) // 女生数量
      })
    },
    getSong () {
      getAllSong().then(res => {
        this.song = res.data
        this.songCount = res.data.length
      })
    },
    getSinger () {
      getAllSinger().then(res => {
        this.singer = res.data
        this.singerCount = res.data.length
        this.singerSex.rows[0]['总数'] = this.setSex(1, this.singer) // 男歌手数量
        this.singerSex.rows[1]['总数'] = this.setSex(0, this.singer) // 女歌手数量
        this.singerSex.rows[2]['总数'] = this.setSex(3, this.singer) // 组合数量
        this.singerSex.rows[3]['总数'] = this.setSex(2, this.singer) // 不明数量
        for (let item of this.singer) {
          this.setLocation(item.location)
        }
      })
    },
    getSongList () {
      getAllSongList().then(res => {
        this.songList = res.data
        this.songListCount = res.data.length
        for (let item of this.songList) {
          this.setStyle(item.style)
        }
      })
    },
    setSex (sex, val) {
      let count = 0
      for (let item of val) {
        if (sex === item.sex) {
          count++
        }
      }
      return count
    },
    setStyle (style) {
      let count = 0
      for (let item of this.songStyle.rows) {
        if (style.includes(item['风格'])) {
          item['总数']++
        }
      }
      return count
    },
    setLocation (location) {
      let count = 0
      for (let item of this.country.rows) {
        if (location.includes(item['国籍'])) {
          item['总数']++
        }
      }
      return count
    }
  }
}
</script>

<style>
.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
  justify-content: center;
  font-size: 14px;
  color: darkgray;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

</style>
