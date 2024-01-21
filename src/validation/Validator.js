import dayjs from "dayjs";

export default function validate(validations, value) {
  var v = {
    type: null,
    required: false,
    min: null,
    max: null,
    regex: null,
    regexError: null,
    enum: [],
    ...validations,
  };

  if (v.type === "integer" || v.type === "float") {
    if (v.required && !value) {
      return { valid: false, msg: "This field is required" };
    } else if (!value) {
      return { valid: true, msg: "This field is valid" };
    }

    if (v.min && value < v.min) {
      return {
        valid: false,
        msg: `This field must be greater than or equal to ${v.min}`,
      };
    }

    if (v.max && value > v.max) {
      return {
        valid: false,
        msg: `This field must be less than or equal to ${v.max}`,
      };
    }

    if (v.regex && !v.regex.test(value)) {
      return {
        valid: false,
        msg: v.regexError ?? "This field is not in the correct format",
      };
    }

    if (v.enum.length > 0 && !v.enum.includes(value)) {
      return {
        valid: false,
        msg: "This field value is not in expected enum",
      };
    }

    return { valid: true, msg: "This field is valid" };
  } else if (v.type === "string") {
    if (v.required && !value) {
      return { valid: false, msg: "This field is required" };
    } else if (!value) {
      return { valid: true, msg: "This field is valid" };
    }

    if (v.min && value.length < v.min) {
      return {
        valid: false,
        msg: `This field must at least ${v.min} characters`,
      };
    }

    if (v.max && value.length > v.max) {
      return {
        valid: false,
        msg: `This field cannot exceed ${v.max} characters`,
      };
    }

    if (v.regex && !v.regex.test(value)) {
      return {
        valid: false,
        msg: v.regexError ?? "This field is not in the correct format",
      };
    }

    if (v.enum.length > 0 && !v.enum.includes(value)) {
      return {
        valid: false,
        msg: "This field value is not in expected enum",
      };
    }

    return { valid: true, msg: "This field is valid" };
  } else if (v.type === "date") {
    if (v.required && !value) {
      return { valid: false, msg: "This field is required" };
    } else if (!value) {
      return { valid: true, msg: "This field is valid" };
    }

    const date = dayjs(value);

    if (v.min) {
      const minDate = v.min === "today" ? dayjs().startOf("day") : dayjs(v.min);

      if (date.diff(minDate, "milliseconds") < 0) {
        return {
          valid: false,
          msg: `This field must have a future date after ${v.min}`,
        };
      }
    }

    if (v.max) {
      const maxDate = v.max === "today" ? dayjs().startOf("day") : dayjs(v.max);

      if (maxDate.diff(date, "milliseconds") < 0) {
        return {
          valid: false,
          msg: `This field must have a past date before ${v.max}`,
        };
      }
    }

    if (v.regex && !v.regex.test(value)) {
      return {
        valid: false,
        msg: v.regexError ?? "This field is not in the correct format",
      };
    }

    if (v.enum.length > 0 && !v.enum.includes(value)) {
      return {
        valid: false,
        msg: "This field value is not in expected enum",
      };
    }

    return { valid: true, msg: "This field is valid" };
  } else if (v.type === "time") {
    if (v.required && !value) {
      return { valid: false, msg: "This field is required" };
    } else if (!value) {
      return { valid: true, msg: "This field is valid" };
    }

    const date = dayjs(value, "hh:mm A");

    if (v.min) {
      const minDate = dayjs(v.min, "hh:mm A");

      if (date.diff(minDate, "seconds") < 0) {
        return {
          valid: false,
          msg: `This field must have a future time after ${v.min}`,
        };
      }
    }

    if (v.max) {
      const maxDate = dayjs(v.max, "hh:mm A");

      if (maxDate.diff(date, "seconds") < 0) {
        return {
          valid: false,
          msg: `This field must have a past time before ${v.max}`,
        };
      }
    }

    if (v.regex && !v.regex.test(value)) {
      return {
        valid: false,
        msg: v.regexError ?? "This field is not in the correct format",
      };
    }

    if (v.enum.length > 0 && !v.enum.includes(value)) {
      return {
        valid: false,
        msg: "This field value is not in expected enum",
      };
    }

    return { valid: true, msg: "This field is valid" };
  }
}

export const validations = {
  firstName: { type: "string", required: true, max: 30 },
  lastName: { type: "string", required: true, max: 30 },
  gender: { type: "string", required: true, enum: ["male", "female"] },
  birthday: {
    type: "date",
    required: true,
    min: "1980-01-01",
    max: "today",
  },
  phone: {
    type: "string",
    required: true,
    regex: /^0\d{9}$/,
    regexError: "Phone number must start with 0 and must contain 10 digits",
  },
  email: {
    type: "string",
    required: true,
    max: 50,
    regex: /^\S+@\S+\.\S+$/,
  },
  password: {
    type: "string",
    required: true,
    min: 8,
    max: 20,
    regex: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/,
    regexError:
      "The password must contain at least one symbol, one digit, one lowercase letter and one uppercase letter",
  },
  confirmPassword: {
    type: "string",
    required: true,
    min: 8,
    max: 20,
  },
  address: {
    type: "string",
    required: true,
    max: 200,
  },
  bio: {
    type: "string",
    required: true,
    min: 100,
    max: 500,
  },
  regNo: {
    type: "string",
    required: true,
    max: 30,
  },
  indexNo: {
    type: "string",
    required: true,
    max: 20,
  },
  faculty: {
    type: "string",
    required: true,
  },
  height: {
    type: "float",
    required: true,
    min: 0.0,
    max: 300.0,
  },
  weight: {
    type: "float",
    required: true,
    min: 0.0,
    max: 500.0,
  },
  bloodGroup: {
    type: "string",
    required: true,
    enum: ["a+", "a-", "b+", "b-", "o+", "o-", "ab+", "ab-"],
  },
  diseases: {
    type: "string",
    max: 1000,
  },
};
