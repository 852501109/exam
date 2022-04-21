// 计算随访随访结局文本内容
const getFollowUpSurveyConclusion = (form, type, gender, referral) => {
	
	const typeL = type.toLowerCase(),
		genderL = gender.toLowerCase()

	const typeText = (typeL === "tnb") ? "血糖" : "血压"
	const text = {
		referralText: null,
		resultText: null,
		bmiText: null,
		cigaretteText: null,
		alcoholText: null,
		sportText: null,
		foodText: null,
		medicineText: null,
		hypoglycemiaText: null
	}

	if (form.bmi && form.bmi > 24) {
		text.bmiText = "减轻体重"
	}
	if (form.countCigarette && form.countCigarette > 0) {
		text.cigaretteText = "戒烟"
	}
	if (form.countWine && form.countWine > 0) {
		text.alcoholText = "戒酒"
	}
	if (form.frequency && form.frequency < 5 || form.exercise && form.exercise < 30) {
		text.sportText = "身体条件允许的情况下适当运动"
	}
	if (form.stapleFood && ((genderL === "m" && form.stapleFood >= 300) || (genderL === "f" && form.stapleFood >=
			250))) {
		text.foodText = "注意控制饮食"
	}
	if (form.medicationCompliance && parseInt(form.medicationCompliance) > 1) {
		text.medicineText = "规律服药"
	}
	if (form.hypoglycemiaReaction && parseInt(form.hypoglycemiaReaction) > 1) {
		text.hypoglycemiaText = "注意低血糖反应"
	}
	if (form.classifyFollowUp && parseInt(form.classifyFollowUp) == 1) {
		text.resultText = "本次随访" + typeText + "控制满意，建议3个月再次随访"
	} else if (form.classifyFollowUp && parseInt(form.classifyFollowUp) == 2) {
		text.resultText = "本次随访" + typeText + "控制不满意，建议14天内再次随访"
	}

	if (referral) {
		text.referralText = "本次随访为转诊情况随访"
	}

	const conclusion = []

	for (const [key, value] of Object.entries(text)) {
		if (value != null) {
			conclusion.push(value)
		}
	}
	console.log(JSON.stringify(conclusion))
	return conclusion.join("，") + "。"
}

export {
	getFollowUpSurveyConclusion
}
