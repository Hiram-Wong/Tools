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
						<t-textarea
							v-model="originalVaule"
							placeholder="Input Original Text"
							name="changedlEditArea"
							:autosize="{ minRows: 5, maxRows: 5 }"
						/>
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
								<t-checkbox value="ignoreCase">忽略大小写</t-checkbox>
								<!-- <t-checkbox value="ignoreWhitespace">逐字</t-checkbox> -->
								<t-checkbox value="sortBeforeConpare">先排序在对比</t-checkbox>
							</t-checkbox-group>
						</t-col>
						<t-col :flex="1">
							<t-space align="start">
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
						<t-radio-group v-model="configuration.outputFormat" variant="default-filled" size="small">
							<t-radio-button value="line-by-line">
								<span>Inline</span>
							</t-radio-button>
							<t-radio-button value="side-by-side">
								<span>Split</span>
							</t-radio-button>
						</t-radio-group>
						<div v-html="prettyHtml" class="mg-top vue-code-diff-lite auto"></div>
					</t-col>
				</t-row>
			</t-card>
		</div>
	</div>
</template>
<script setup>
import { ref, watch } from 'vue';
import _ from 'lodash';
import { createPatch } from 'diff';
import { html, parse } from "diff2html";
import '@/style/theme/html2diff.less';

const display = ref('text');
const originalVaule = ref('');
const changedVaule = ref('');
const parameter = ref(['ignoreCase']);
const configuration = ref({
	drawFileList: false,
  matching: 'world', // world lines
	outputFormat: 'side-by-side' // line-by-line  side-by-side
});
const prettyHtml = ref('');

watch(configuration,() => {
	compare()
},{ deep: true })

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

const clearTextArea = () => {
	originalVaule.value = changedVaule.value = "";
	prettyHtml.value = "";
};

const compare = () => {
	// 判断勾选项
	let ignoreCase = _.indexOf(parameter.value, 'ignoreCase') === -1 ? false:true;
	let ignoreWhitespace = _.indexOf(parameter.value, 'ignoreWhitespace') === -1 ? false:true;
	let sortBeforeConpare = _.indexOf(parameter.value, 'sortBeforeConpare') === -1 ? false:true;
	// console.log(ignoreCase,sortBeforeConpare);

	if (sortBeforeConpare) {
		originalVaule.value = sortLines(originalVaule.value, ignore_case);
		changedVaule.value = sortLines(changedVaule.value, ignore_case);
	}
	// console.log('left:' + leftVaule.value + '  right:' + rightVaule.value);

	let unitedDiff = createPatch('', originalVaule.value, changedVaule.value, '', '', { ignoreCase: ignoreCase });
	
	// let unitedDiff = diffLines(originalVaule.value, changedVaule.value);
	console.log(unitedDiff)

	const diffJson = parse(unitedDiff);
	// console.log(diffJson);

	const diffHtml = html(
		diffJson, {
			...configuration.value
		}
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
		border-radius: @border-radius-10;
	}
	.text-content {
		box-shadow: @box-shadow-light-1;
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
}
</style>