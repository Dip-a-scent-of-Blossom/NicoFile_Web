<script setup>
import Vditor from 'vditor'
import {onMounted, ref} from "vue";
import 'vditor/dist/index.css';
import '@/assets/css/article.less'
import axios from "axios";
import {local} from "@/assets/js/file.js";
import {jwtDecode} from "jwt-decode";
import Router from "@/router/index.js";
import router from '@/router/index.js';
const route = router
const wikiContent = '' // 这里就是要展示的文章，一般从后端接口获取
const article = ref()
const ar  = "# 贪心 （ 水题 2200 )\n" +
    "\n" +
    "------\n" +
    "\n" +
    "## 题意\n" +
    "\n" +
    "题目给你一个大小为 $ n $ 的数组 $ a $ ,表示第 $ i $ 列的格子从 $ 1 - a_i $ 是黑色的，剩下的都是白色的，那么我们可以把这张图看成一个山脉地形的竖剖面(地理乱入)，同时题目还给了我们一个 $ m $ 表示我们可以把 $ 1-m $ 填入白色格子中，并且每个格子最多填入一个数字(每个数字只能填一次)，答案要求我们输出填充完数字后，每行内每一组连续的数字是一个公差为 $ 1 $ 的等差序列的长度 $ -1 $ 。\n" +
    "\n" +
    "------\n" +
    "\n" +
    "## 解法思路\n" +
    "\n" +
    "手玩样例可以发现，如果一个等差序列的长度为 $ x $ 那么他的贡献就是 $ x - 1 $ ，毛估估想，他的长度越长那么贡献的性价比就越大。\n" +
    "既然我们把它看成一张竖剖图，我们可以用一根线从上到下扫描他所覆盖的空白格子，那么我们可以用优先队列将每次扫描到的区间存起来，贪心选择他的长度，然后缩短区间，如法炮制。\n" +
    "\n" +
    "![](https://raw.githubusercontent.com/ManInM00N/Pics/main/20240402210813.png)\n" +
    "\n" +
    "这样的操作，我们就需要用到优先队列来维护，当区间扫下来遇到隔断时，就对 $ [ l , r ] $ 这个区间进行拆分，为了避免一些极端情况，我们用 ST 表来维护区间的最大值，即当剩下的区间是满足高度条件，但是走完这段区间会浪费很多时间，因此对剩下的区间查询最大的高度是否小于我需要的高度可以做到提前跳出循环避免超时。\n" +
    "\n" +
    "```cpp\n" +
    "#include <bits/stdc++.h>\n" +
    "using namespace std;\n" +
    "typedef long long ll;\n" +
    "const int maxn = 2e6 + 7;\n" +
    "const int N = 2e5+7;\n" +
    "const int INF = 0x3f3f3f3f;\n" +
    "ll n, m, cnt, k, x, y, z;\n" +
    "#define ls p << 1\n" +
    "#define rs p << 1 | 1\n" +
    "#define Pa pair<ll, ll>\n" +
    "#define YES cout << \"YES\\n\"\n" +
    "#define NO cout << \"NO\\n\"\n" +
    "#define rep(i,n) for(int i = 0; i < (int)n; i++)\n" +
    "#define FOR(n) for(int i = 0; i < (int)n; i++)\n" +
    "#define repi(i,a,b) for(int i = (int)a; i < (int)b; i++)\n" +
    "ll st[N][20];\n" +
    "void init(){\n" +
    "    for (int k = 1; k < 20; k++)\n" +
    "    {\n" +
    "        for (int i = 1; i <= n; i++)\n" +
    "        {\n" +
    "            if (i+(1ll<<(k-1))<=n)\n" +
    "                st[i][k]= max(st[i][k-1],st[i+(1ll<<(k-1))][k-1]);\n" +
    "        }\n" +
    "    }\n" +
    "}\n" +
    "ll query(ll l,ll r){\n" +
    "    ll len = log2(r-l+1);\n" +
    "    return max(st[l][len],st[r-(1ll<<(len))+1][len]);\n" +
    "}\n" +
    "struct pos{\n" +
    "    ll l,r,h;\n" +
    "    bool operator<(const pos& a) const{\n" +
    "        return r-l< a.r-a.l;\n" +
    "    }\n" +
    "};\n" +
    "void solve()\n" +
    "{\n" +
    "    cin >>n ;\n" +
    "    vector<ll> a(n+2);\n" +
    "    repi(i,1,n+1){\n" +
    "        cin >>st[i][0];\n" +
    "        a[i] = st[i][0];\n" +
    "    }   \n" +
    "    cin >>m;\n" +
    "    init();\n" +
    "    priority_queue<pos> q;\n" +
    "    a[0] = n+1;\n" +
    "    a[n+1] = n+1;\n" +
    "    vector<ll> point;\n" +
    "    ll height = n;\n" +
    "    repi(i,1,n+1){\n" +
    "        if (a[i]<height&&((a[i-1]>=height)^(a[i+1]>=height))){\n" +
    "            point.push_back(i);\n" +
    "        }\n" +
    "    }\n" +
    "    for (int i = 0; i < point.size(); i+=2){\n" +
    "        q.push({point[i],point[i+1],n});//把合法区间放进去\n" +
    "    }\n" +
    "    ll ans =0 ;\n" +
    "    auto check=[&](ll l,ll r,ll h)->void{\n" +
    "        ll tt = a[l-1];\n" +
    "        a[l-1] = n+1;\n" +
    "        while(r>=l){\n" +
    "            if (a[r]<h&&a[r-1]<h){\n" +
    "                break;\n" +
    "            }\n" +
    "            r--;//找到第一个有效的右端点\n" +
    "        }\n" +
    "        if (r<=l) return ;\n" +
    "        vector<ll> p;\n" +
    "        while (l<=r){\n" +
    "            if (a[l]<h&&((a[l-1]>=h)^(a[l+1]>=h))){\n" +
    "                p.push_back(l);\n" +
    "            }\n" +
    "            if (query(l,r)<h){\n" +
    "                break;\n" +
    "            }\n" +
    "            l++;\n" +
    "        }\n" +
    "        p.push_back(r);\n" +
    "        for (int i = 0; i < p.size(); i+=2){\n" +
    "            q.push({p[i],p[i+1],h});//区间拆分如法炮制\n" +
    "        }\n" +
    "        a[l-1] = tt;\n" +
    "    };\n" +
    "    while (!q.empty()&&m>0)\n" +
    "    {\n" +
    "        auto [l,r,h] = q.top();\n" +
    "        q.pop();\n" +
    "        ll nxth = query(l,r);//求出这段区间可以贪多少高度\n" +
    "        ll lst = min(h-nxth,m/(r-l+1));\n" +
    "        m-= lst*(r-l+1);\n" +
    "        ans += lst*(r-l);\n" +
    "        if (lst<h-nxth){\n" +
    "            if (m>0)\n" +
    "                ans+=m-1;\n" +
    "            m = 0;\n" +
    "            break;//特判是否填不完\n" +
    "        }\n" +
    "        check(l,r,nxth);\n" +
    "    }\n" +
    "    cout << ans<<'\\n';\n" +
    "}\n" +
    "int main()\n" +
    "{\n" +
    "    ios::sync_with_stdio(0);\n" +
    "    cin.tie(0), cout.tie(0);\n" +
    "    ll t = 1;\n" +
    "    cin >>t;\n" +
    "    while (t--)\n" +
    "        solve();\n" +
    "    return 0;\n" +
    "}\n" +
    "```"
onMounted(async ()=>{
  let id = route.currentRoute.value.params.id
  try{
    const res =await axios.post(local + "api/v1/article/"+id, {
    })
    if (res.status === 200) {
      
    }else{
      
    }
  }catch( error){

    // Router.push("/login")
  }
  let str = "1234141"

  await Vditor.preview( document.getElementById('article'), ar, {
    speech: {
      enable: false,
    },
    anchor: 1,
    // mode:'dark',
    // theme:'dark',

    after() {
      console.log(111)
    },

  })

})
</script>

<template>
  <div class="container">
      <div class="normal-container" >
        <div class="container" id ="article-container" style="padding:16px 24px;border-radius: 10px">

          <div class="vditor-reset" style="position: relative">
            <div style="float:left;display: flex;flex-direction: column">
              <span style="font-weight: bold">作者</span>
              <span>ManInM00N</span>
            </div>
            <div style="float:right;display: flex;flex-direction: column">
              <span style="font-weight: bold;">发布时间</span>
              <span>2024-07-29</span>
            </div>
<!--            <span style="float:left">作者:ManInM00N</span>-->
<!---->
<!--            <span style="float:right">发布时间:2024-07-29</span>-->
          </div>
          <div id="article"  >

          </div>
        </div>
      </div>
  </div>
</template>

<style scoped lang="less">

@import "../assets/css/container.less";
@import "../assets/css/color.less";
@import "@/assets/css/elOverWrite.less";
@import "@/assets/css/article.less";
#article-container{
  background-color: @theme-second-color-light;
  border-radius: 10px;
}


</style>