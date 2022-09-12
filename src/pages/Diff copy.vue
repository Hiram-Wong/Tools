<template>
  <div class="diff-container mx-auto">
    <div class="head">
			<t-row>
				<t-col :flex="12">
					<h1 class="header-title">DiffChecker</h1>
				</t-col>
				<t-col :flex="1">
					<t-radio-group v-model="display" variant="default-filled">
						<t-radio-button value="text">
							<t-icon name="rectangle" />
						</t-radio-button>
						<t-radio-button value="file">
							<t-icon name="add-rectangle" />
						</t-radio-button>
					</t-radio-group>
				</t-col>
			</t-row>
    </div>
		
		<div class="textarea mg-top">
			<t-card :bordered="false" shadow>
				<t-row>
					<t-col :flex="12">
						<div class="upload" v-show="display=='file'">
							<t-upload
								theme="file"
								:auto-upload="false"
								@select-change="openFile($event, 'original')"
							>
								<t-button theme="primary" ghost size="small" variant="dashed">Upload Original File</t-button>
							</t-upload>
						</div>
						<div class="line-edit-wrapper">
							<div class="left-bar-wrapper">
								<!-- <t-textarea
									ref="OriginalBarValue"
									v-model="barValue"
									class="bar-area"
									disabled
									:autosize="{ minRows: 5, maxRows: 5 }"
								/> -->
								<textarea
									ref="originalBarValue"
									v-model="barValue"
									rows="5"
									wrap="no"
									class="bar-area"
								/>
							</div>
							<div class="rigth-edit-wrapper">
								<!-- <t-textarea
									ref="changedlEditArea"
									v-model="originalVaule"
									placeholder="Input Original Text"
									name="changedlEditArea"
									:autosize="{ minRows: 5, maxRows: 5 }"
									@change="syncScrollTop"
								/> -->
								<textarea
									ref="changedlEditArea"
									v-model="originalVaule"
									placeholder="Input Original Text"
									name="changedlEditArea"
									:autosize="{ minRows: 5, maxRows: 5 }"
									class="edit-area"
									@scroll="syncScrollTop"
								/>
							</div>
						</div>
					</t-col>
					<t-col :flex="1"></t-col>
					<t-col :flex="12">
						<div class="upload" v-show="display=='file'">
							<t-upload
								theme="file"
								:auto-upload="false"
								@select-change="openFile($event, 'change')"
							>
								<t-button theme="primary" ghost size="small" variant="dashed">Upload Changed File</t-button>
							</t-upload>
						</div>
						<t-textarea
							v-model="changedVaule"
							placeholder="Input Changed Text"
							name="description"
							:autosize="{ minRows: 5, maxRows: 5 }"
						/>
					</t-col>
				</t-row>

				<div class="parameter mg-top">
					<t-row>
						<t-col :flex="11">
							<t-checkbox-group v-model="parameter" @change="onParameter">
								<t-checkbox :check-all="true">全选</t-checkbox>
								<t-checkbox value="ignoreCase" id="ignore_case">忽略大小写</t-checkbox>
								<t-checkbox value="sortBeforeConpare" id="sort">先排序在对比</t-checkbox>
							</t-checkbox-group>
						</t-col>
						<t-col :flex="1">
							<t-space>
								<t-button theme="primary" shape="rectangle" variant="base" size="small" type="reset" @click="clearTextArea">清空</t-button>
								<t-button theme="primary" shape="rectangle" variant="base" size="small" type="button" @click="compare">对比</t-button>
							</t-space>
						</t-col>
					</t-row>
				</div>
			</t-card>
		</div>

    <div class="restult mg-top" v-show="prettyHtml">
			<t-card :bordered="false" shadow>
				<t-row>
					<t-col :flex="12">
						<div v-html="prettyHtml"></div>
					</t-col>
				</t-row>
			</t-card>
		</div>
	</div>
</template>
<script setup>
import { ref, watch,onMounted } from 'vue';
import _ from 'lodash';
import {  createPatch } from 'diff';
import { html, parse } from "diff2html";
import 'diff2html/bundles/css/diff2html.min.css';

const originalBarValue = ref('');
const changedlEditArea = ref('');
const barValue = ref('1');
const display = ref('text');
const originalVaule = ref('');
const changedVaule = ref('');
const parameter = ref(['ignoreCase']);
const prettyHtml = ref(null);

const openFile = (event, postion) => {
	console.log(postion)
	console.log(event)
	let reader = new FileReader();
	reader.readAsText(event[0]);
	reader.onload = function (resultFile) {
		let pointsTxt = resultFile.target.result;
		postion === 'original' ? originalVaule.value = pointsTxt: changedVaule.value = pointsTxt;
	};
  return false;
};

// 循环行数
const line = (n) => {
	let num = ''
	for (let i = 1; i <= n; i++) {
		num += i + '\n'
	}
	barValue.value = num
	// console.log('获取dom元素',changedlEditArea.value)
	// console.log('获取dom元素',changedlEditArea.value.scrollTop)
	console.log(changedlEditArea.value.scrollTop, originalBarValue.value.scrollTop)
};

onMounted(() => {
	
})

watch(originalVaule,(val) => {
  let str = val;
	str = str.replace(/\r/gi, '');
	str = str.split('\n');
	const n = str.length;
	line(n)
	// console.log(document.getElementsByName('changedlEditArea'))
})

// 同步滚动
const syncScrollTop = () => {
	console.log('change')
	originalBarValue.value.scrollTop = changedlEditArea.value.scrollTop
}

const onParameter = (val) => {
  console.log(parameter.value, val);
};

const sortLines = (org_string, ignore_case) =>{
	return org_string.split('\n').sort(
		(a, b) => {
			if (ignore_case) {
				a = a.toLowerCase();
				b = b.toLowerCase();
			}
			if (a < b) return -1;
			if (a > b) return 1;
			return 0;
		}
	).join('\n');
}

const copyClipboard = () => {}

const clearTextArea = () => {
	originalVaule.value = changedVaule.value = "";
	prettyHtml.value = "";
};

const compare = () => {
	let ignoreCase = _.indexOf(parameter.value, 'ignoreCase') === -1 ? false:true;
	let sortBeforeConpare = _.indexOf(parameter.value, 'sortBeforeConpare') === -1 ? false:true;
	console.log(ignoreCase,sortBeforeConpare);

	if (sortBeforeConpare) {
		originalVaule.value = sortLines(originalVaule.value, ignore_case);
		changedVaule.value = sortLines(changedVaule.value, ignore_case);
	}
	prettyHtml.value = "";
	// console.log('left:' + leftVaule.value + '  right:' + rightVaule.value);

	let unitedDiff = createPatch('', originalVaule.value, changedVaule.value, '', '', { context: 999, ignoreCase: ignoreCase });
	// console.log(unitedDiff)

	const diffJson = parse(unitedDiff);
	// console.log(diffJson);

	const diffHtml = html(
		diffJson,
		{ drawFileList: false, matching: 'lines', outputFormat: 'side-by-side' }
	);

	// console.log(diffHtml);
	prettyHtml.value = diffHtml;
}


</script>

<style lang="less" scoped>
@import '@/style/variables';
@import '@/style/index.less';
.diff-container {
	padding: 10px;
	.mg-top{
		margin-top: 10px;
	}
	:deep(.t-textarea__inner) {
		resize: none;
		// border-radius: @border-radius-10;
    border-radius: 0 @border-radius-10 @border-radius-10 0;
	}
	.text-content {
		box-shadow: @box-shadow-light-1;
	}
	:deep(.d2h-file-side-diff) {
		margin-bottom: 0 !important;
    margin-right: 0 !important;
	}
	.header-title {
    font-size: var(--title-font-size, 32px);
    color: var(--text-primary);
    text-align: left;
    line-height: 32px;
		margin: 0;
    transition: top 0.2s var(--anim-time-fn-easing),opacity 0.2s linear,visibility 0.2s linear;
	}
	.upload {
		text-align: center;
		margin-bottom: 5px;
	}
	.line-edit-wrapper{
		display: flex;
		justify-content: flex-start;
	}
	.left-bar-wrapper{
		background:#ecf0f5;
		width:35px; 
		text-align:left;
    border-radius: @border-radius-10 0 0 @border-radius-10;
	}
	.rigth-edit-wrapper{
		width: 100%;
	}
	.edit-area{
		border:1px solid #eaeaea;
		outline:none;
		height:100%;
		resize: none;
		background: rgb(250,250,250);
		line-height: 24px;
		font-size: 14px;
		color: black;
		font-family: inherit;
		box-sizing: border-box;
	}
	.bar-area :deep(textarea){
		height:100% !important;
		width: 100%;
		resize: none;
		outline:none;
		overflow-y: hidden;
		overflow-x: hidden; border: 0;
		background: rgb(247,247,247);
		color: #999;
		text-align: right;
		font-weight: bold;
		border-radius: 10px 0 0 10px !important;
	}

	.bar-area {
		height:100% !important;
		width: 100%;
		resize: none;
		outline:none;
		overflow-y: hidden;
		overflow-x: hidden; border: 0;
		background: rgb(247,247,247);
		color: #999;
		line-height: 24px;
		font-size: 14px;
		text-align: right;
		font-weight: bold;
		border-radius: 10px 0 0 10px !important;
	}

	.bar-area {
		height: 100%;
	}
}
</style>