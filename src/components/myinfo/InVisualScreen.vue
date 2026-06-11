<template>

    <!-- TODO: 添加布局调整功能 -->
    <!-- 根容器宽度高度均自适应父级走马灯容器 -->
    <div ref="dashboardWrapperRef" class="dashboard-wrapper">
        <!-- 大屏整体自适应容器 (标准设计稿1920x1080，基于父级容器大小进行3D Scale缩放) -->
        <div ref="appContainerRef" class="app-container flex flex-col">

            <!-- 顶部 Header -->
            <header class="h-[90px] w-full flex items-start justify-between px-10 relative z-10 header-bg pt-4">
                <!-- 左侧时间与刷新控制 -->
                <div class="w-1/3 flex flex-col gap-1 text-sm">
                    <div class="flex items-center gap-4 text-cyan-200">
                        <span class="text-xl font-bold font-mono tracking-wider">{{ currentTime }}</span>
                        <span>{{ currentDate }}</span>
                        <span>{{ currentWeek }}</span>
                    </div>
                    <div class="flex items-center gap-3 text-xs">
                        <span class="text-blue-300">天气：晴 24°C</span>
                        <div class="flex items-center gap-1.5 ml-2 cursor-pointer" @click="toggleRefresh">
                            <span
                                :class="['w-2 h-2 rounded-full', isAutoRefresh ? 'bg-green-400 animate-ping' : 'bg-gray-400']"></span>
                            <span class="text-xs" :class="isAutoRefresh ? 'text-green-400' : 'text-gray-400'">
                                {{ isAutoRefresh ? '数据实时刷新中' : '自动刷新已暂停' }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- 中间大标题 -->
                <div class="w-1/3 text-center -mt-2">
                    <h1 class="text-4.5xl font-extrabold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-white via-[#00f3ff] to-[#0066ff]"
                        style="filter: drop-shadow(0 4px 6px rgba(0,243,255,0.4));">
                        智慧电网资产运行管控平台
                    </h1>
                </div>

                <!-- 右侧系统信息 (融合 Element Plus) -->
                <div class="w-1/3 flex justify-end items-center gap-4 text-sm text-cyan-200">
                    <!-- 全屏交互按钮 -->
                    <el-button size="small" type="info" plain class="fullscreen-btn" @click="toggleFullscreen">
                        <span class="flex items-center gap-1">
                            <svg v-if="!isFullscreen" class="w-3.5 h-3.5" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24" width="14" height="14">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l-5 5m11 5v-4m0 4h-4m4 0l-5-5">
                                </path>
                            </svg>
                            <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                width="14" height="14">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 14h4v4m0-4l-5 5m15-5h-4v4m0-4l5 5M4 10h4V6m0 4L3 5m17 5h-4V6m0 4l5-5"></path>
                            </svg>
                            {{ isFullscreen ? '退出全屏' : '全屏展示' }}
                        </span>
                    </el-button>

                    <!-- 筛选重置快捷键 -->
                    <el-button size="small" type="primary" plain class="filter-reset-btn" @click="resetAllFilters">
                        重置筛选
                    </el-button>

                    <el-dropdown trigger="click">
                        <span
                            class="el-dropdown-link flex items-center gap-2 cursor-pointer hover:text-white transition text-cyan-200">
                            <svg class="w-5 h-5 flex-shrink-0" width="20" height="20" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                            电力调度中心 (Admin)
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu class="dark-dropdown-menu">
                                <el-dropdown-item>调度台配置</el-dropdown-item>
                                <el-dropdown-item>负荷报表下载</el-dropdown-item>
                                <el-dropdown-item divided>切换账户</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </header>

            <!-- 主内容区 -->
            <main class="flex-1 w-full px-6 pb-6 flex gap-6 relative z-0 -mt-2">

                <!-- 左侧面板 -->
                <aside class="w-[450px] flex flex-col gap-6 z-10 flex-shrink-0">
                    <!-- 模块1：电力核心资产概览 (数据卡片) -->
                    <div class="tech-panel flex-1 flex flex-col p-5">
                        <div class="corner-bottom"></div>
                        <div class="panel-title mb-4">
                            <span>{{ activeNavTitle }} - 输配电指标</span>
                        </div>
                        <div class="grid grid-cols-2 gap-4 flex-1">
                            <div
                                class="bg-blue-900/20 border border-blue-500/20 rounded p-3 flex flex-col justify-center items-center gap-1 hover:bg-blue-800/30 transition">
                                <span class="text-xs text-blue-200">电网实时总负荷</span>
                                <div class="flex items-baseline gap-1">
                                    <span class="text-3xl glow-text">{{ totalGridLoad.toFixed(1) }}</span>
                                    <span class="text-xs text-cyan-300">MW</span>
                                </div>
                            </div>
                            <div
                                class="bg-blue-900/20 border border-blue-500/20 rounded p-3 flex flex-col justify-center items-center gap-1 hover:bg-blue-800/30 transition">
                                <span class="text-xs text-blue-200">综合输电损耗率</span>
                                <div class="flex items-baseline gap-1">
                                    <span class="text-3xl glow-text text-yellow-400"
                                        style="text-shadow: 0 0 10px rgba(250, 204, 21, 0.6);">{{ lossRate.toFixed(2)
                                        }}</span>
                                    <span class="text-xs text-yellow-300">%</span>
                                </div>
                            </div>
                            <div
                                class="bg-blue-900/20 border border-blue-500/20 rounded p-3 flex flex-col justify-center items-center gap-1 hover:bg-blue-800/30 transition">
                                <span class="text-xs text-blue-200">当日新能源消纳</span>
                                <div class="flex items-baseline gap-1">
                                    <span class="text-3xl glow-text text-green-400"
                                        style="text-shadow: 0 0 10px rgba(74, 222, 128, 0.6);">{{
                                        greenEnergyRate.toFixed(1)
                                        }}</span>
                                    <span class="text-xs text-green-300">%</span>
                                </div>
                            </div>
                            <div
                                class="bg-blue-900/20 border border-blue-500/20 rounded p-3 flex flex-col justify-center items-center gap-1 hover:bg-blue-800/30 transition">
                                <span class="text-xs text-blue-200">当日累计发电量</span>
                                <div class="flex items-baseline gap-1">
                                    <span class="text-3xl glow-text">{{ accumulatedGeneration.toLocaleString() }}</span>
                                    <span class="text-xs text-cyan-300">MWh</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 模块2：电网负荷与绿电出力趋势 (折线图) -->
                    <div class="tech-panel h-[320px] flex flex-col p-5">
                        <div class="corner-bottom"></div>
                        <div class="panel-title mb-2 flex justify-between items-center pr-2">
                            <span>负荷与绿电出力趋势对比</span>
                            <div class="flex gap-2 text-xs">
                                <span
                                    class="bg-cyan-900/50 text-cyan-300 px-2 py-1 rounded cursor-pointer border border-cyan-500/50">实时</span>
                                <span class="text-gray-400 px-2 py-1 cursor-pointer hover:text-cyan-300">预测</span>
                            </div>
                        </div>
                        <div ref="chartTrendRef" class="flex-1 w-full h-full"></div>
                    </div>

                    <!-- 模块3：电网实时预警 -->
                    <div class="tech-panel flex-1 flex flex-col p-5">
                        <div class="corner-bottom"></div>
                        <div class="panel-title mb-4">实时电力故障告警</div>
                        <div class="flex text-xs text-cyan-300 bg-cyan-900/30 py-2 px-3 mb-2 font-bold flex-shrink-0">
                            <div class="w-[20%]">时间</div>
                            <div class="w-[35%]">受检资产</div>
                            <div class="w-[25%]">异常参数</div>
                            <div class="w-[20%] text-center">风险级</div>
                        </div>
                        <div class="flex-1 overflow-y-auto text-xs space-y-2 pr-1 custom-scrollbar">
                            <div v-for="(alert, i) in filteredAlerts" :key="i"
                                class="flex py-2.5 px-3 bg-blue-900/10 hover:bg-blue-800/40 transition border-b border-blue-800/30 items-center">
                                <div class="w-[20%] text-gray-400">{{ alert.time }}</div>
                                <div class="w-[35%] text-blue-200 font-mono truncate" :title="alert.device">{{
                                    alert.device }}</div>
                                <div class="w-[25%] text-cyan-400 font-mono">{{ alert.val }}</div>
                                <div class="w-[20%] text-center">
                                    <span :class="[
                                        'px-2 py-0.5 rounded text-[10px] font-bold',
                                        alert.level === '危急' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                    ]">
                                        {{ alert.level }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                <!-- 中间面板 (支持鼠标拖拽与滚轮缩放的核心地图区) -->
                <section class="flex-1 flex flex-col relative z-0 min-w-[500px]">
                    <!-- 筛选条件栏 (电力行业多维度维度筛选) -->
                    <div class="absolute top-4 left-4 right-4 z-20 pointer-events-none flex flex-col gap-3">
                        <div class="flex justify-between items-center w-full">
                            <!-- 电压等级多维交互 -->
                            <div
                                class="bg-black/75 border border-[#00f3ff]/30 p-2 rounded backdrop-blur-md pointer-events-auto flex items-center gap-3">
                                <span class="text-xs text-cyan-300 font-bold pl-1">电压等级:</span>
                                <el-radio-group v-model="voltageFilter" size="small" class="custom-radio-group"
                                    @change="onFilterChange">
                                    <el-radio-button label="all">全部</el-radio-button>
                                    <el-radio-button label="500">500kV</el-radio-button>
                                    <el-radio-button label="220">220kV</el-radio-button>
                                    <el-radio-button label="110">110kV</el-radio-button>
                                </el-radio-group>
                            </div>

                            <!-- 能源类型筛选 -->
                            <div
                                class="bg-black/75 border border-[#00f3ff]/30 p-2 rounded backdrop-blur-md pointer-events-auto flex items-center gap-3">
                                <span class="text-xs text-green-300 font-bold pl-1">电能来源:</span>
                                <el-radio-group v-model="energyTypeFilter" size="small"
                                    class="custom-radio-group green-theme" @change="onFilterChange">
                                    <el-radio-button label="all">全部</el-radio-button>
                                    <el-radio-button label="clean">新能源</el-radio-button>
                                    <el-radio-button label="fire">常规火电</el-radio-button>
                                </el-radio-group>
                            </div>
                        </div>

                        <!-- 数据快照展示 -->
                        <div class="flex justify-between items-center gap-4 mt-1">
                            <div
                                class="bg-black/40 border border-[#00f3ff]/30 p-4 rounded backdrop-blur-sm pointer-events-auto flex items-center gap-4 flex-1">
                                <div
                                    class="w-12 h-12 rounded-full border-2 border-[#00f3ff] flex items-center justify-center flex-shrink-0 bg-blue-950/50">
                                    <svg class="w-6 h-6 text-[#00f3ff]" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <div class="text-[10px] text-blue-200">当前区域发受电平衡系数</div>
                                    <div class="text-2xl glow-text font-mono">{{ balanceRatio.toFixed(2) }}</div>
                                </div>
                            </div>

                            <div
                                class="bg-black/40 border border-green-400/30 p-4 rounded backdrop-blur-sm pointer-events-auto flex items-center gap-4 flex-1">
                                <div
                                    class="w-12 h-12 rounded-full border-2 border-green-400 flex items-center justify-center flex-shrink-0 bg-green-950/50">
                                    <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <div class="text-[10px] text-blue-200">综合功率因数 (Cos φ)</div>
                                    <div class="text-2xl text-green-400 font-bold font-mono"
                                        style="text-shadow: 0 0 10px rgba(74, 222, 128, 0.6);">{{ powerFactor.toFixed(3)
                                        }}</div>
                                </div>
                            </div>
                        </div>

                        <!-- 操作说明提示 (自适应流式布局，彻底免去了 absolute 像素定位冲突，自动排列在指标大卡片下方) -->
                        <div
                            class="self-start text-[11px] text-gray-400 bg-black/60 border border-[#00f3ff]/20 px-3 py-1.5 rounded pointer-events-none flex items-center gap-1.5 backdrop-blur-sm shadow-lg">
                            <span class="w-1.5 h-1.5 rounded-full bg-[#00f3ff] animate-pulse flex-shrink-0"></span>
                            <span>💡 提示：使用鼠标滚轮进行缩放，按住鼠标左键可拖拽平移。点击变电站或电厂图标可查看负荷、主变温度等精细详情。</span>
                        </div>
                    </div>

                    <!-- 可拖拽与滚轮缩放的画布外框 -->
                    <div class="flex-1 relative overflow-hidden flex items-center justify-center select-none"
                        @wheel.prevent="handleMapWheel" @mousedown="handleMapMouseDown" @mousemove="handleMapMouseMove"
                        @mouseup="handleMapMouseUp" @mouseleave="handleMapMouseUp"
                        :class="isDraggingMap ? 'cursor-grabbing' : 'cursor-grab'">
                        <!-- 整体可控缩放平移图层 (去除了 flex 布局防止子定位塌陷，统一在 600x600 的相对空间内构建) -->
                        <div class="absolute w-[600px] h-[600px] transition-transform duration-75 ease-out"
                            :style="{ transform: `translate(${mapTranslateX}px, ${mapTranslateY}px) scale(${mapScale})` }">
                            <!-- 虚幻环境底光 -->
                            <div
                                class="absolute inset-0 bg-[#00f3ff] opacity-[0.03] rounded-full blur-[80px] z-0 pointer-events-none">
                            </div>

                            <!-- 核心同心环拓扑雷达 -->
                            <div
                                class="absolute inset-0 border border-[#00f3ff]/20 rounded-full z-0 flex items-center justify-center pointer-events-none">
                                <div
                                    class="w-[400px] h-[400px] border border-[#00f3ff]/15 rounded-full flex items-center justify-center">
                                    <div class="w-[250px] h-[250px] border border-[#00f3ff]/10 rounded-full"></div>
                                </div>
                                <!-- 动态扫描光束 -->
                                <div class="radar-scan-circle"></div>
                                <!-- 十字分划线 -->
                                <div class="absolute w-full h-px bg-[#00f3ff]/10"></div>
                                <div class="absolute h-full w-px bg-[#00f3ff]/10"></div>
                            </div>

                            <!-- 拓扑连接引线 (完美对齐 600x600 实际物理节点坐标) -->
                            <svg class="absolute inset-0 pointer-events-none z-10 opacity-60 w-full h-full"
                                viewBox="0 0 600 600">
                                <defs>
                                    <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stop-color="#00f3ff" stop-opacity="0.2" />
                                        <stop offset="50%" stop-color="#ffaa00" stop-opacity="0.8" />
                                        <stop offset="100%" stop-color="#00f3ff" stop-opacity="0.2" />
                                    </linearGradient>
                                </defs>
                                <!-- 蜀西(240,180) 到 锦江(420,360) -->
                                <path v-if="matchStation('500', 'fire') && matchStation('220', 'fire')"
                                    d="M 240 180 L 420 360" stroke="url(#flowGrad)" stroke-width="2"
                                    stroke-dasharray="6 4" class="animate-dash" />
                                <!-- 蜀西(240,180) 到 光伏B区(120,270) -->
                                <path v-if="matchStation('500', 'fire') && matchStation('220', 'clean')"
                                    d="M 240 180 L 120 270" stroke="#00f3ff" stroke-width="1.5" opacity="0.4" />
                                <!-- 锦江(420,360) 到 临港(210,450) -->
                                <path v-if="matchStation('220', 'fire') && matchStation('110', 'fire')"
                                    d="M 420 360 L 210 450" stroke="#00f3ff" stroke-width="1.5" opacity="0.4" />
                            </svg>

                            <!-- 变电站/发电站地理标记点 (基于 600x600 容器百分比完美平铺定位，绝对不会塌陷和重叠) -->
                            <div class="absolute inset-0 z-20 pointer-events-none">

                                <!-- 500kV 蜀西超高压变电站 (x:240, y:180 -> top: 30%, left: 40%) -->
                                <div v-if="matchStation('500', 'fire')" class="map-node-interactive"
                                    style="top: 30%; left: 40%;"
                                    @click.stop="openNodeDetail('500kV 蜀西超高压变电站', { type: '常规枢纽站', volt: '500kV', load: '1840MW', temp: '42.6℃', desc: '负责城西片区主网架构支撑，目前处于重载平衡态。' })">
                                    <div class="map-point"></div>
                                    <span class="node-label">⚡ 500kV 蜀西超高压变电站</span>
                                </div>

                                <!-- 220kV 锦江变电站 (x:420, y:360 -> top: 60%, left: 70%) -->
                                <div v-if="matchStation('220', 'fire')" class="map-node-interactive"
                                    style="top: 60%; left: 70%;"
                                    @click.stop="openNodeDetail('220kV 锦江城市核心变电站', { type: '配电中心站', volt: '220kV', load: '940MW', temp: '38.2℃', desc: '支撑中心商务区负荷，出线潮流均衡。' })">
                                    <div class="map-point"></div>
                                    <span class="node-label">⚡ 220kV 锦江变电站</span>
                                </div>

                                <!-- 110kV 山区风力发电厂 A区 (x:390, y:150 -> top: 25%, left: 65%) -->
                                <div v-if="matchStation('110', 'clean')" class="map-node-interactive"
                                    style="top: 25%; left: 65%;"
                                    @click.stop="openNodeDetail('110kV 风力发电场 A区', { type: '绿色电厂', volt: '110kV', load: '180MW', temp: '25.3℃', desc: '高海拔风机群落，目前风速平稳，全额消纳中。' })">
                                    <div class="map-point warning"></div>
                                    <span class="node-label text-yellow-300">🍃 110kV 风电场 A区</span>
                                </div>

                                <!-- 220kV 双流集中式光伏站 (x:120, y:270 -> top: 45%, left: 20%) -->
                                <div v-if="matchStation('220', 'clean')" class="map-node-interactive"
                                    style="top: 45%; left: 20%;"
                                    @click.stop="openNodeDetail('220kV 集中式光伏电站 B区', { type: '绿色高压电站', volt: '220kV', load: '320MW', temp: '29.8℃', desc: '光照充足，无功补偿补偿设备正在稳定运转。' })">
                                    <div class="map-point danger"></div>
                                    <span class="node-label text-red-300">☀ 220kV 光伏电网 B区</span>
                                </div>

                                <!-- 110kV 临港配电站 (x:210, y:450 -> top: 75%; left: 35%) -->
                                <div v-if="matchStation('110', 'fire')" class="map-node-interactive"
                                    style="top: 75%; left: 35%;"
                                    @click.stop="openNodeDetail('110kV 临港工业区变电站', { type: '用户专用配电站', volt: '110kV', load: '210MW', temp: '31.1℃', desc: '对接口工业重载用户，负荷平缓无功无越标。' })">
                                    <div class="map-point"></div>
                                    <span class="node-label">⚡ 110kV 临港配电站</span>
                                </div>
                            </div>
                        </div>

                        <!-- 地图点击查看详情卡片 (可关闭) -->
                        <div v-if="activeNodeInfo"
                            class="absolute bottom-4 left-4 z-30 bg-black/85 border border-[#00f3ff]/60 p-4 rounded-lg backdrop-blur-md w-[320px] pointer-events-auto shadow-2xl animate-fade-in text-xs">
                            <div class="flex justify-between items-center border-b border-[#00f3ff]/30 pb-2 mb-2">
                                <span class="text-sm font-bold text-[#00f3ff]">{{ activeNodeName }}</span>
                                <button @click="activeNodeInfo = null"
                                    class="text-gray-400 hover:text-white text-base font-bold px-1">×</button>
                            </div>
                            <div class="space-y-1.5 text-blue-200">
                                <div class="flex justify-between"><span class="text-gray-400">资产类别:</span> <span
                                        class="font-bold text-white">{{ activeNodeInfo.type }}</span></div>
                                <div class="flex justify-between"><span class="text-gray-400">电压等级:</span> <span
                                        class="font-bold text-cyan-300">{{ activeNodeInfo.volt }}</span></div>
                                <div class="flex justify-between"><span class="text-gray-400">当前实测负荷:</span> <span
                                        class="font-bold text-yellow-400 font-mono">{{ activeNodeInfo.load }}</span>
                                </div>
                                <div class="flex justify-between"><span class="text-gray-400">主变运行温度:</span> <span
                                        class="font-bold text-orange-400 font-mono">{{ activeNodeInfo.temp }}</span>
                                </div>
                                <div class="text-gray-400 pt-1 leading-relaxed border-t border-blue-900/40 mt-1.5">
                                    {{ activeNodeInfo.desc }}
                                </div>
                            </div>
                        </div>

                        <!-- 右上角地图控制项 (用于微调缩放与平移复位) -->
                        <div
                            class="absolute bottom-4 right-4 z-30 bg-black/80 border border-[#00f3ff]/30 p-1.5 rounded flex flex-col gap-1.5 pointer-events-auto">
                            <button @click="zoomMap(1.2)" class="map-control-btn" title="放大">＋</button>
                            <button @click="zoomMap(0.8)" class="map-control-btn" title="缩小">－</button>
                            <button @click="resetMapTransform" class="map-control-btn" title="复位到初始视角">
                                <svg class="w-4 h-4 text-[#00f3ff] transition-transform duration-300 hover:rotate-90"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 3v3m0 12v3m9-9h-3m-12 0H3m16.242-6.242l-2.122 2.122m-8.484 8.484l-2.122 2.122m14.142 0l-2.122-2.122M6.343 6.343l-2.122 2.122M12 8a4 4 0 100 8 4 4 0 000-8z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- 底部控制按钮 (下方导航一键联动更新状态) -->
                    <div class="h-20 w-full flex justify-center items-end pb-2 z-20 gap-4 flex-shrink-0">
                        <button v-for="(nav, index) in navList" :key="index" @click="onNavSwitch(index)"
                            :class="['nav-btn px-8 py-2 rounded text-sm text-cyan-200 font-bold tracking-widest', activeNav === index ? 'active' : '']">
                            {{ nav }}
                        </button>
                    </div>
                </section>

                <!-- 右侧面板 -->
                <aside class="w-[450px] flex flex-col gap-6 z-10 flex-shrink-0">
                    <!-- 模块1：变配电设备运行状态 -->
                    <div class="tech-panel h-[180px] flex flex-col p-5">
                        <div class="corner-bottom"></div>
                        <div class="panel-title mb-4">输变电设备健康监控</div>
                        <div class="flex justify-between items-center h-full gap-3">
                            <div
                                class="flex-1 bg-gradient-to-br from-green-900/40 to-green-900/10 border border-green-500/30 rounded p-4 flex flex-col items-center justify-center relative overflow-hidden">
                                <div class="absolute right-0 top-0 w-8 h-8 bg-green-500/20 rounded-bl-full"></div>
                                <span class="text-xs text-green-200 mb-1">主变运行正常</span>
                                <span class="text-3xl font-bold text-green-400 font-mono">{{ normalDeviceCount }}</span>
                            </div>
                            <div
                                class="flex-1 bg-gradient-to-br from-yellow-900/40 to-yellow-900/10 border border-yellow-500/30 rounded p-4 flex flex-col items-center justify-center relative overflow-hidden">
                                <div class="absolute right-0 top-0 w-8 h-8 bg-yellow-500/20 rounded-bl-full"></div>
                                <span class="text-xs text-yellow-200 mb-1">重载/温升预警</span>
                                <span class="text-3xl font-bold text-yellow-400 font-mono">{{ warningDeviceCount
                                    }}</span>
                            </div>
                            <div
                                class="flex-1 bg-gradient-to-br from-red-900/40 to-red-900/10 border border-red-500/30 rounded p-4 flex flex-col items-center justify-center relative overflow-hidden">
                                <div class="absolute right-0 top-0 w-8 h-8 bg-red-500/20 rounded-bl-full"></div>
                                <span class="text-xs text-red-200 mb-1">保护越障告警</span>
                                <span class="text-3xl font-bold text-red-500 font-mono">{{ dangerDeviceCount }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- 模块2：电能构成占比 (环形图) -->
                    <div class="tech-panel h-[280px] flex flex-col p-5">
                        <div class="corner-bottom"></div>
                        <div class="panel-title mb-2">多源供能出力比例</div>
                        <div class="flex-1 flex w-full">
                            <div ref="chartPieRef" class="w-1/2 h-full"></div>
                            <div class="w-1/2 h-full flex flex-col justify-center gap-3 pl-4">
                                <div v-for="(energy, idx) in energyShareData" :key="idx">
                                    <div class="flex justify-between text-xs text-cyan-200 mb-1">
                                        <span class="flex items-center gap-1.5">
                                            <span class="w-1.5 h-1.5 rounded-full"
                                                :style="{ backgroundColor: energyColors[idx] }"></span>
                                            {{ energy.name }}
                                        </span>
                                        <span class="font-bold" :style="{ color: energyColors[idx] }">{{ energy.value
                                            }}%</span>
                                    </div>
                                    <div class="w-full h-1.5 bg-blue-900/50 rounded-full overflow-hidden">
                                        <div class="h-full rounded-full transition-all duration-1000"
                                            :style="{ width: energy.value + '%', backgroundColor: energyColors[idx] }">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 模块3：本周电能质量分析 (柱状图) -->
                    <div class="tech-panel flex-1 flex flex-col p-5">
                        <div class="corner-bottom"></div>
                        <div class="panel-title mb-2">电能质量越标分类统计</div>
                        <div id="chart-bar" ref="chartBarRef" class="flex-1 w-full h-full"></div>
                    </div>
                </aside>
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import * as echarts from 'echarts'

// --- 自适应大屏容器依赖 ---
const dashboardWrapperRef = ref(null)
const appContainerRef = ref(null)

// --- 图表DOM Refs ---
const chartTrendRef = ref(null)
const chartPieRef = ref(null)
const chartBarRef = ref(null)

// --- 头部系统信息 ---
const currentTime = ref('00:00:00')
const currentDate = ref('2026-05-20')
const currentWeek = ref('星期三')
const isFullscreen = ref(false)

// --- 多维筛选参数 & 数据 ---
const voltageFilter = ref('all') // 'all', '500', '220', '110'
const energyTypeFilter = ref('all') // 'all', 'clean', 'fire'
const activeNav = ref(0)
const navList = ['综合态势', '负荷潮流', '保电网格', '变配自愈']
const activeNavTitle = computed(() => navList[activeNav.value])

// --- 中间拓扑地图交互参数 ---
const mapScale = ref(1.0)
const mapTranslateX = ref(0)
const mapTranslateY = ref(0)
const isDraggingMap = ref(false)
const activeNodeName = ref('')
const activeNodeInfo = ref(null)

let dragStartX = 0
let dragStartY = 0

// 实时刷新开关
const isAutoRefresh = ref(true)

// --- 响应式电力模拟业务数据 ---
const totalGridLoad = ref(5642.4)
const lossRate = ref(4.32)
const greenEnergyRate = ref(45.8)
const accumulatedGeneration = ref(120489)
const balanceRatio = ref(1.02)
const powerFactor = ref(0.942)

const normalDeviceCount = ref(1248)
const warningDeviceCount = ref(38)
const dangerDeviceCount = ref(3)

// 能源占比静态配色
const energyColors = ['#ffaa00', '#00f3ff', '#3b82f6', '#10b981', '#8b5cf6']
const energyShareData = computed(() => {
    // 随着过滤变化比例
    if (energyTypeFilter.value === 'clean') {
        return [
            { name: '风电出力', value: 45 },
            { name: '光伏出力', value: 35 },
            { name: '水电消纳', value: 20 },
            { name: '常规煤电', value: 0 },
            { name: '核电基荷', value: 0 }
        ]
    } else if (energyTypeFilter.value === 'fire') {
        return [
            { name: '常规煤电', value: 85 },
            { name: '核电基荷', value: 15 },
            { name: '风电出力', value: 0 },
            { name: '光伏出力', value: 0 },
            { name: '水电消纳', value: 0 }
        ]
    }
    return [
        { name: '常规煤电', value: 42 },
        { name: '风电出力', value: 25 },
        { name: '水电消纳', value: 15 },
        { name: '光伏出力', value: 10 },
        { name: '核电基荷', value: 8 }
    ]
})

// 电厂及变电站站点匹配逻辑 (中心地图过滤)
const matchStation = (voltage, type) => {
    const matchVolt = voltageFilter.value === 'all' || voltageFilter.value === voltage
    const matchType = energyTypeFilter.value === 'all' || energyTypeFilter.value === type
    return matchVolt && matchType
}

// 模拟警报列表原始数据
const allAlerts = [
    { time: '16:11:12', device: '500kV 蜀西主变#1', val: '油温 92.5℃', level: '危急', volt: '500', type: 'fire' },
    { time: '16:08:45', device: '110kV 风力发电 A区', val: '过电压越限', level: '严重', volt: '110', type: 'clean' },
    { time: '16:05:30', device: '220kV 集中光伏 B区', val: '逆功率异常', level: '严重', volt: '220', type: 'clean' },
    { time: '15:58:22', device: '110kV 临港变电站', val: '母线电压越下限', level: '危急', volt: '110', type: 'fire' },
    { time: '15:52:10', device: '220kV 锦江二线', val: '线路潮流重载', level: '严重', volt: '220', type: 'fire' },
    { time: '15:45:04', device: '山地风电支线 #18', val: '桨叶桨距偏差', level: '严重', volt: '110', type: 'clean' }
]

// 过滤警报数据
const filteredAlerts = computed(() => {
    return allAlerts.filter(alert => {
        const voltMatch = voltageFilter.value === 'all' || alert.volt === voltageFilter.value
        const typeMatch = energyTypeFilter.value === 'all' || alert.type === energyTypeFilter.value
        return voltMatch && typeMatch
    })
})

// ECharts 实例引用
let trendChart = null
let pieChart = null
let barChart = null
let timeInterval = null
let refreshInterval = null
let resizeObserver = null

// --- 全屏状态监测 ---
const monitorFullscreenState = () => {
    isFullscreen.value = !!document.fullscreenElement
}

// --- 一键全屏切换 ---
const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
        dashboardWrapperRef.value?.requestFullscreen().catch(err => {
            console.error(`无法进入全屏模式: ${err.message}`)
        })
    } else {
        document.exitFullscreen()
    }
}

// --- 中间面板手势逻辑 (拖拽平移 & 滚轮缩放) ---
const handleMapWheel = (e) => {
    const zoomFactor = 1.1
    const direction = e.deltaY < 0 ? 1 : -1
    let nextScale = mapScale.value

    if (direction > 0) {
        nextScale = Math.min(3.5, mapScale.value * zoomFactor)
    } else {
        nextScale = Math.max(0.6, mapScale.value / zoomFactor)
    }
    mapScale.value = nextScale
}

const handleMapMouseDown = (e) => {
    isDraggingMap.value = true
    dragStartX = e.clientX - mapTranslateX.value
    dragStartY = e.clientY - mapTranslateY.value
}

const handleMapMouseMove = (e) => {
    if (!isDraggingMap.value) return
    mapTranslateX.value = e.clientX - dragStartX
    mapTranslateY.value = e.clientY - dragStartY
}

const handleMapMouseUp = () => {
    isDraggingMap.value = false
}

// 地图控制面板交互
const zoomMap = (ratio) => {
    mapScale.value = Math.max(0.6, Math.min(3.5, mapScale.value * ratio))
}

const resetMapTransform = () => {
    mapScale.value = 1.0
    mapTranslateX.value = 0
    mapTranslateY.value = 0
}

// 点击节点打开详情
const openNodeDetail = (name, info) => {
    activeNodeName.value = name
    activeNodeInfo.value = info
}

// --- 底部导航切换联动更新 ---
const onNavSwitch = (idx) => {
    activeNav.value = idx
    activeNodeInfo.value = null // 切换看板时关闭地图弹窗

    // 模拟不同业务板块的数据切片变换
    if (idx === 0) { // 综合态势
        totalGridLoad.value = 5642.4
        lossRate.value = 4.32
        greenEnergyRate.value = 45.8
        normalDeviceCount.value = 1248
        warningDeviceCount.value = 38
        dangerDeviceCount.value = 3
    } else if (idx === 1) { // 负荷潮流
        totalGridLoad.value = 6842.1
        lossRate.value = 5.12
        greenEnergyRate.value = 33.4
        normalDeviceCount.value = 1195
        warningDeviceCount.value = 84
        dangerDeviceCount.value = 10
    } else if (idx === 2) { // 保电网格
        totalGridLoad.value = 4120.5
        lossRate.value = 3.45
        greenEnergyRate.value = 62.1
        normalDeviceCount.value = 1280
        warningDeviceCount.value = 9
        dangerDeviceCount.value = 0
    } else if (idx === 3) { // 变配自愈
        totalGridLoad.value = 4890.9
        lossRate.value = 4.10
        greenEnergyRate.value = 51.5
        normalDeviceCount.value = 1255
        warningDeviceCount.value = 31
        dangerDeviceCount.value = 3
    }

    onFilterChange()
}

// --- 时间同步更新 ---
const updateTime = () => {
    const now = new Date()
    currentTime.value = now.getHours().toString().padStart(2, '0') + ':' +
        now.getMinutes().toString().padStart(2, '0') + ':' +
        now.getSeconds().toString().padStart(2, '0')

    currentDate.value = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`
    const weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    currentWeek.value = weeks[now.getDay()]
}

// --- 开启/关闭刷新切换 ---
const toggleRefresh = () => {
    isAutoRefresh.value = !isAutoRefresh.value
}

// --- 恢复所有联动过滤 ---
const resetAllFilters = () => {
    voltageFilter.value = 'all'
    energyTypeFilter.value = 'all'
    activeNodeInfo.value = null
    resetMapTransform()
    onFilterChange()
}

// --- 过滤变更事件 ---
const onFilterChange = () => {
    // 根据不同条件，改变电网特征参数模拟
    let baseLoad = 5000
    if (activeNav.value === 1) baseLoad = 6500
    if (activeNav.value === 2) baseLoad = 4000

    if (voltageFilter.value === '500') {
        totalGridLoad.value = baseLoad * 0.6
        lossRate.value = 2.15
    } else if (voltageFilter.value === '220') {
        totalGridLoad.value = baseLoad * 0.3
        lossRate.value = 4.22
    } else if (voltageFilter.value === '110') {
        totalGridLoad.value = baseLoad * 0.1
        lossRate.value = 5.88
    } else {
        totalGridLoad.value = baseLoad
        lossRate.value = 4.32
    }

    // 绿电消纳比率调整
    if (energyTypeFilter.value === 'clean') {
        greenEnergyRate.value = 100.0
        powerFactor.value = 0.912
    } else if (energyTypeFilter.value === 'fire') {
        greenEnergyRate.value = 0.0
        powerFactor.value = 0.978
    } else {
        greenEnergyRate.value = 45.8
        powerFactor.value = 0.942
    }

    // 更新图表展现
    updateChartsDataset()
}

// --- 模拟实时刷新微幅跳动 ---
const startRealtimeSimulation = () => {
    refreshInterval = setInterval(() => {
        if (!isAutoRefresh.value) return

        // 负荷在 1% 内浮动
        const factor = (Math.random() - 0.5) * 15
        totalGridLoad.value = Math.max(100, totalGridLoad.value + factor)

        // 发电量递增
        accumulatedGeneration.value += Math.floor(Math.random() * 5) + 1

        // 损耗轻微晃动
        lossRate.value = Math.max(1.5, Math.min(8.0, lossRate.value + (Math.random() - 0.5) * 0.05))

        // 刷新折线图实时尾端数据
        if (trendChart) {
            const option = trendChart.getOption()
            const loadData = option.series[0].data
            // 模拟尾部变化
            loadData[loadData.length - 1] = Math.round(totalGridLoad.value * 0.1)
            trendChart.setOption({ series: [{ data: loadData }] })
        }

        // 随机抖动健康度指标
        if (Math.random() > 0.8) {
            normalDeviceCount.value += Math.random() > 0.5 ? 1 : -1
        }
    }, 3000)
}

// --- 自适应缩放逻辑 (ResizeObserver 适配走马灯核心代码) ---
const handleResize = () => {
    if (!appContainerRef.value || !dashboardWrapperRef.value) return

    const designWidth = 1920
    const designHeight = 1080

    // 从大屏的直接父容器中提取真实可用宽高，确保在任何尺寸走马灯下都是全包裹居中缩放
    const containerWidth = dashboardWrapperRef.value.clientWidth
    const containerHeight = dashboardWrapperRef.value.clientHeight

    const scale = Math.min(containerWidth / designWidth, containerHeight / designHeight)

    appContainerRef.value.style.transform = `translate(-50%, -50%) scale(${scale})`

    // 协调图表触发重绘
    trendChart?.resize()
    pieChart?.resize()
    barChart?.resize()
}

// --- 初始化与动态渲染图表 ---
const updateChartsDataset = () => {
    // 基于多维度过滤更改环形图数据
    if (pieChart) {
        const pieData = energyShareData.value.filter(d => d.value > 0)
        pieChart.setOption({
            series: [{ data: pieData }]
        })
    }

    // 变更为对应的柱状图数值
    if (barChart) {
        let baseData = [35, 12, 54, 28, 8]
        if (voltageFilter.value === '500') {
            baseData = [10, 2, 15, 3, 1]
        } else if (voltageFilter.value === '220') {
            baseData = [20, 8, 30, 18, 5]
        } else if (voltageFilter.value === '110') {
            baseData = [5, 2, 9, 7, 2]
        }

        // 如果是保电网格，异常大幅减少
        if (activeNav.value === 2) {
            baseData = baseData.map(val => Math.ceil(val * 0.2))
        }

        barChart.setOption({
            series: [{ data: baseData }]
        })
    }
}

const initCharts = () => {
    const axisLineColor = '#1a3c58'
    const splitLineColor = 'rgba(255,255,255,0.05)'
    const textColor = '#8fa3b8'

    // 1. 折线图 - 负荷出力
    if (chartTrendRef.value) {
        trendChart = echarts.init(chartTrendRef.value)
        trendChart.setOption({
            tooltip: { trigger: 'axis', backgroundColor: 'rgba(0,10,30,0.8)', borderColor: '#00f3ff', textStyle: { color: '#fff' } },
            legend: { data: ['全网实时负荷', '清洁能源出力'], textStyle: { color: textColor }, top: 0, right: 0, itemWidth: 12, itemHeight: 4 },
            grid: { left: '3%', right: '4%', bottom: '3%', top: '15%', containLabel: true },
            xAxis: {
                type: 'category', boundaryGap: false,
                data: ['02:00', '06:00', '10:00', '14:00', '18:00', '22:00', '当前'],
                axisLabel: { color: textColor }, axisLine: { lineStyle: { color: axisLineColor } }
            },
            yAxis: [
                { type: 'value', name: '兆瓦 (MW)', nameTextStyle: { color: textColor }, splitLine: { lineStyle: { color: splitLineColor } }, axisLabel: { color: textColor } }
            ],
            series: [
                {
                    name: '全网实时负荷', type: 'line', smooth: true, symbol: 'none', lineStyle: { width: 3, color: '#00f3ff' },
                    areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(0, 243, 255, 0.4)' }, { offset: 1, color: 'rgba(0, 243, 255, 0.01)' }]) },
                    data: [420, 380, 520, 680, 580, 640, 564]
                },
                {
                    name: '清洁能源出力', type: 'line', smooth: true, symbol: 'circle', symbolSize: 4,
                    itemStyle: { color: '#10b981' }, lineStyle: { width: 2, color: '#10b981' },
                    data: [150, 180, 310, 420, 220, 180, 258]
                }
            ]
        })
    }

    // 2. 环形图 - 能源占比
    if (chartPieRef.value) {
        pieChart = echarts.init(chartPieRef.value)
        pieChart.setOption({
            tooltip: { trigger: 'item', formatter: '{b}: {c}%', backgroundColor: 'rgba(0,10,30,0.8)', borderColor: '#00f3ff', textStyle: { color: '#fff' } },
            color: energyColors,
            series: [{
                name: '多源供能', type: 'pie', radius: ['45%', '70%'], center: ['50%', '50%'],
                itemStyle: { borderRadius: 4, borderColor: 'rgba(6, 20, 43, 1)', borderWidth: 2 },
                label: { show: false, position: 'center' },
                emphasis: { label: { show: true, formatter: '{b}\n{c}%', fontSize: '13', fontWeight: 'bold', color: '#fff' } },
                data: energyShareData.value
            }]
        })
    }

    // 3. 柱状图 - 电能质量异常事件
    if (chartBarRef.value) {
        barChart = echarts.init(chartBarRef.value)
        barChart.setOption({
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, backgroundColor: 'rgba(0,10,30,0.8)', borderColor: '#00f3ff', textStyle: { color: '#fff' } },
            grid: { left: '3%', right: '4%', bottom: '5%', top: '15%', containLabel: true },
            xAxis: {
                type: 'category', data: ['电压偏差', '谐波越标', '频率越限', '三相不平衡', '瞬时电压闪变'],
                axisLabel: { color: textColor, interval: 0, fontSize: 10 }, axisLine: { lineStyle: { color: axisLineColor } }
            },
            yAxis: { type: 'value', name: '发生次数', nameTextStyle: { color: textColor }, splitLine: { lineStyle: { color: splitLineColor } }, axisLabel: { color: textColor } },
            series: [{
                name: '异常次数', type: 'bar', barWidth: '30%',
                itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#00f3ff' }, { offset: 1, color: '#3b82f6' }]), borderRadius: [4, 4, 0, 0] },
                data: [35, 12, 54, 28, 8]
            }]
        })
    }
}

// --- 生命周期钩子 ---
onMounted(() => {
    updateTime()
    timeInterval = setInterval(updateTime, 1000)
    startRealtimeSimulation()

    // 监听全屏切换状态变化，同步状态按钮状态
    document.addEventListener('fullscreenchange', monitorFullscreenState)

    // 使用先进的 ResizeObserver 动态响应包裹容器的变动，这对于走马灯Slide内部初始化尤为关键
    resizeObserver = new ResizeObserver(() => {
        handleResize()
    })
    if (dashboardWrapperRef.value) {
        resizeObserver.observe(dashboardWrapperRef.value)
    }

    // 确保 DOM 准备完毕并执行首次渲染
    setTimeout(() => {
        initCharts()
        handleResize()
    }, 150)
})

onUnmounted(() => {
    clearInterval(timeInterval)
    clearInterval(refreshInterval)
    document.removeEventListener('fullscreenchange', monitorFullscreenState)
    if (resizeObserver && dashboardWrapperRef.value) {
        resizeObserver.unobserve(dashboardWrapperRef.value)
    }
    trendChart?.dispose()
    pieChart?.dispose()
    barChart?.dispose()
})
</script>

<style>
/* 显式引入 Tailwind 样式库 */
@import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
</style>

<style scoped>
/* 根容器：完全跟随走马灯组件的 Slide 的高度与宽度 */
.dashboard-wrapper {
    width: 100%;
    height: 100%;
    min-height: 100%;
    background-color: #030816;
    color: #c0d1e3;
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image:
        linear-gradient(rgba(0, 114, 255, 0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 114, 255, 0.04) 1px, transparent 1px);
    background-size: 30px 30px;
}

/* 视口适配器：以 1920x1080 作为完美比例。
   借助 transform: scale 在任意走马灯尺寸内都能实现自动压缩或拉伸，杜绝被走马灯切边 */
.app-container {
    width: 1920px;
    height: 1080px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform-origin: center center;
    display: flex;
    flex-direction: column;
}

/* 补充自有的 Flex 兜底实现，对抗外部某些特殊框架样式对布局的破环 */
main {
    display: flex !important;
    flex-direction: row !important;
}

aside {
    display: flex !important;
    flex-direction: column !important;
}

/* 顶部全屏与筛选组件高级定制 */
.fullscreen-btn {
    background-color: rgba(255, 255, 255, 0.05) !important;
    border-color: rgba(255, 255, 255, 0.2) !important;
    color: #e2e8f0 !important;
}

.fullscreen-btn:hover {
    background-color: rgba(255, 255, 255, 0.15) !important;
    border-color: #ffffff !important;
}

.filter-reset-btn {
    background-color: rgba(0, 243, 255, 0.1) !important;
    border-color: rgba(0, 243, 255, 0.3) !important;
    color: #00f3ff !important;
}

.filter-reset-btn:hover {
    background-color: rgba(0, 243, 255, 0.2) !important;
    border-color: #00f3ff !important;
}

/* 电网电压筛选高级覆写 */
.custom-radio-group :deep(.el-radio-button__inner) {
    background-color: rgba(6, 20, 43, 0.8) !important;
    color: #8fa3b8 !important;
    border-color: rgba(0, 243, 255, 0.3) !important;
}

.custom-radio-group :deep(.el-radio-button__orig-radio:checked + .el-radio-button__inner) {
    background-color: rgba(0, 243, 255, 0.2) !important;
    color: #00f3ff !important;
    border-color: #00f3ff !important;
    box-shadow: -1px 0 0 0 #00f3ff !important;
}

.custom-radio-group.green-theme :deep(.el-radio-button__orig-radio:checked + .el-radio-button__inner) {
    background-color: rgba(16, 185, 129, 0.2) !important;
    color: #10b981 !important;
    border-color: #10b981 !important;
    box-shadow: -1px 0 0 0 #10b981 !important;
}

/* 下拉菜单在暗黑主题下的覆盖 (若项目中有全局配置可删) */
:deep(.el-dropdown-menu) {
    background-color: #0a1931 !important;
    border: 1px solid rgba(0, 243, 255, 0.3) !important;
}

:deep(.el-dropdown-menu__item) {
    color: #c0d1e3 !important;
}

:deep(.el-dropdown-menu__item:hover) {
    background-color: rgba(0, 243, 255, 0.1) !important;
    color: #00f3ff !important;
}

/* 经典数据面板 */
.tech-panel {
    position: relative;
    background: rgba(6, 20, 43, 0.7);
    border: 1px solid rgba(13, 56, 110, 0.8);
    box-shadow: inset 0 0 20px rgba(0, 114, 255, 0.1);
    backdrop-filter: blur(4px);
    display: flex;
    flex-direction: column;
}

.tech-panel::before,
.tech-panel::after,
.tech-panel .corner-bottom::before,
.tech-panel .corner-bottom::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    border-color: #00f3ff;
    border-style: solid;
    pointer-events: none;
}

.tech-panel::before {
    top: -1px;
    left: -1px;
    border-width: 2px 0 0 2px;
}

.tech-panel::after {
    top: -1px;
    right: -1px;
    border-width: 2px 2px 0 0;
}

.tech-panel .corner-bottom::before {
    bottom: -1px;
    left: -1px;
    border-width: 0 0 2px 2px;
}

.tech-panel .corner-bottom::after {
    bottom: -1px;
    right: -1px;
    border-width: 0 2px 2px 0;
}

.panel-title {
    position: relative;
    padding-left: 12px;
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    text-shadow: 0 0 8px rgba(0, 243, 255, 0.6);
    display: flex;
    align-items: center;
}

.panel-title::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 14px;
    background: #00f3ff;
    box-shadow: 0 0 8px #00f3ff;
}

.header-bg {
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><polygon points="0,0 100%,0 95%,100% 5%,100%" fill="rgba(10,35,80,0.5)" stroke="%2300f3ff" stroke-width="1"/></svg>') no-repeat center bottom;
    background-size: 60% 100%;
}

/* 地品操作与雷达 */
.radar-scan-circle {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300px;
    height: 300px;
    background: linear-gradient(135deg, rgba(0, 243, 255, 0.0) 0%, rgba(0, 243, 255, 0.0) 50%, rgba(0, 243, 255, 0.25) 100%);
    transform-origin: 0% 0%;
    animation: radar-spin 8s linear infinite;
    border-right: 1.5px solid rgba(0, 243, 255, 0.5);
    border-radius: 0 0 300px 0;
}

@keyframes radar-spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* 地图节点动效与交互样式 */
.map-node-interactive {
    position: absolute;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    pointer-events: auto !important;
    /* 拦截鼠标拖拽，实现可独立点击 */
    z-index: 30;
}

.map-node-interactive:hover .map-point {
    box-shadow: 0 0 20px #00f3ff, 0 0 40px #00f3ff;
    transform: scale(1.3);
}

.map-node-interactive:hover .node-label {
    text-shadow: 0 0 8px #00f3ff;
    color: #fff;
    opacity: 1;
}

.node-label {
    position: absolute;
    top: -24px;
    white-space: nowrap;
    font-size: 10px;
    font-weight: 500;
    color: #a5f3fc;
    transition: all 0.2s ease;
    pointer-events: none;
    background: rgba(1, 15, 30, 0.85);
    padding: 2.5px 8px;
    border-radius: 4px;
    border: 1px solid rgba(0, 243, 255, 0.35);
}

.map-point {
    width: 14px;
    height: 14px;
    background-color: #00f3ff;
    border-radius: 50%;
    box-shadow: 0 0 12px #00f3ff;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.map-point::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 24px;
    height: 24px;
    border: 1.5px solid #00f3ff;
    border-radius: 50%;
    animation: point-pulse 2s ease-out infinite;
}

.map-point.warning {
    background-color: #ffaa00;
    box-shadow: 0 0 12px #ffaa00;
}

.map-point.warning::after {
    border-color: #ffaa00;
}

.map-point.danger {
    background-color: #ff4646;
    box-shadow: 0 0 12px #ff4646;
}

.map-point.danger::after {
    border-color: #ff4646;
}

@keyframes point-pulse {
    0% {
        width: 14px;
        height: 14px;
        opacity: 1;
    }

    100% {
        width: 50px;
        height: 50px;
        opacity: 0;
    }
}

/* 地图操作微调按钮 */
.map-control-btn {
    width: 32px;
    height: 32px;
    background-color: rgba(6, 20, 43, 0.85);
    border: 1px solid rgba(0, 243, 255, 0.4);
    color: #00f3ff;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
}

.map-control-btn:hover {
    background-color: rgba(0, 243, 255, 0.2);
    border-color: #00f3ff;
    color: #fff;
    box-shadow: 0 0 6px rgba(0, 243, 255, 0.4);
}

.glow-text {
    color: #00f3ff;
    text-shadow: 0 0 10px rgba(0, 243, 255, 0.6);
    font-family: 'Impact', sans-serif;
    letter-spacing: 2px;
}

.nav-btn {
    background: linear-gradient(180deg, rgba(0, 243, 255, 0.1) 0%, rgba(0, 243, 255, 0.02) 100%);
    border: 1px solid rgba(0, 243, 255, 0.3);
    box-shadow: inset 0 0 10px rgba(0, 243, 255, 0.1);
    transition: all 0.3s ease;
    cursor: pointer;
}

.nav-btn:hover,
.nav-btn.active {
    background: linear-gradient(180deg, rgba(0, 243, 255, 0.3) 0%, rgba(0, 243, 255, 0.1) 100%);
    border-color: #00f3ff;
    box-shadow: 0 0 15px rgba(0, 243, 255, 0.4), inset 0 0 15px rgba(0, 243, 255, 0.2);
    color: #fff;
    text-shadow: 0 0 5px #00f3ff;
}

/* 动感路径流光效果 */
.animate-dash {
    stroke-dasharray: 8 4;
    animation: dash 20s linear infinite;
}

@keyframes dash {
    to {
        stroke-dashoffset: -100;
    }
}

.animate-fade-in {
    animation: fadeIn 0.2s ease-out forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 滚动条定制 */
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
    height: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 243, 255, 0.05);
    border-radius: 2px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(0, 243, 255, 0.4);
    border-radius: 2px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 243, 255, 0.8);
}
</style>