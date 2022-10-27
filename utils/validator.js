'use strict';
const validator = require('validator');

module.exports = class Validator {
  constructor () {
    this.param = '';
  }

  check (param) {
    this.param = param;
    return this;
  }

  // 手机号格式校验
  isMobile () {
    if (this.param !== undefined && this.param !== null && this.param !== '') {
      if (!validator.isMobilePhone(this.param.toString())) {
        throw new Error('404004');
      };
    }
    return this;
  };

  // 是否为有效的MySqlId
  isMySqlId () {
    if (this.param !== undefined && this.param !== null && this.param !== '') {
      if (isNaN(+this.param) || +this.param === 0) {
        throw new Error('404002');
      }
    }
    return this;
  }

  // 不能为空
  notEmpty () {
    if (typeof this.param === 'undefined' || this.param === null || validator.isEmpty(this.param.toString())) {
      throw new Error('404003');
    }
    return this;
  }

  // 校验是否为number类型
  isNumeric () {
    if (this.param !== undefined && this.param !== null && this.param !== '') {
      if (isNaN(+this.param) || !validator.isNumeric(this.param.toString())) {
        throw new Error('404001');
      }
    }
    return this;
  }

  /**
   * 校验该参数的值是否在指定数组中
   * @param {*} arr 指定数组
   */
  in (arr) {
    if (this.param !== undefined && this.param !== null && this.param !== '') {
      if (arr.indexOf(+this.param) === -1) {
        throw new Error('404005');
      }
    }
    return this;
  }

  // 校验是否大于0
  isPositiveInteger () {
    if (this.param !== undefined && this.param !== null && this.param !== '') {
      if (this.param <= 0) {
        throw new Error('404006');
      }
    }
    return this;
  }

  // 当开始时间和结束时间都存在时做校验，开始时间必须小于结束时间
  validateStartAndEndTimeWhenBothExist (startTime, endTime) {
    if (startTime && endTime && startTime >= endTime) {
      throw new Error('404007');
    }
    return this;
  }

  // 校验是否为银行卡号
  isBankAccount () {
    if (this.param !== undefined && this.param !== null && this.param !== '') {
      this.param = this.param.replace(/\s+/g, ''); // 银行卡去除全部空格
      const regex = new RegExp(`[0-9]{${this.param.length}}`);
      if (!regex.test(this.param)) {
        throw new Error('404008');
      }
    }
    return this;
  }
};
