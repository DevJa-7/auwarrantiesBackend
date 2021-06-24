export class UserRole {
    public static USER_ADMIN = 'Admin';
    public static USER_DEALER = 'Dealer';
    public static USER_CUSTOMER = 'Customer';
}

export class ResponseMessage {
    public static readonly OK = 'ok';
    public static readonly SUCCEEDED = 'Succeeded!';
    public static readonly LOGINED = 'user logined!';
    public static readonly FAILED = 'failed';
    public static readonly NO_DATA = 'No Data';
    public static readonly AUTHORIZATION_FAILED = 'Authorization Failed.';
    public static readonly NOT_VERIFIED_USER = 'This user not verified yet. Please verify or sign up again.';
    public static readonly SESSION_UNDEFINED = 'Session Undefined.';
    public static readonly NOT_CONFIRMED_EMAIL = 'Please verify this email and then try to login.';
    public static readonly INVALID_TOKEN = 'Token is not valid. Please try again.';
    public static readonly ALREADY_REGISTERED = 'You registered already. Please confirm again.';
    public static readonly INVALID_PARAM_OR_INTERNAL_ERROR = 'Invalid Parameters or Internal Server Error.';
    public static readonly INVALID_VERIFICATION_CODE = 'Invalid verification code.';
    public static readonly INVALID_PHONE_NUMBER = 'Invalid phone number.';
    public static readonly NOT_IMPLEMENTED_YET = 'Not implemented yet.';
    public static readonly NOT_FOUND_GARAGE = 'Not Found such garage.';
    public static readonly DUPLICATED_USER = 'There already exists a user has same post code or email.';
    public static readonly NOT_FOUND_USER = 'Not found user';
    public static readonly WRONG_VERIFY_CODE = 'Wrong Verification Code';
    public static readonly DUPLICATED_USERNAME = 'This username is already existed. Please select the other name.';

    public static readonly INVALID_OPERATION = 'Invalid operation';

    public static readonly FAILED_STRIPE_PAY = 'Failed to stripe pay.';
    public static readonly ALREADY_PAID = 'Already paid.';
    public static readonly NOT_ACCEPTED_QUOTE = 'Does not accepted this quote.';

    public static readonly NOT_FOUND_RECORD = 'Not Found such record.';
    public static readonly DUPLICATED_RECORD = 'Alread exist such record.';
    public static readonly NO_POLICY = 'No Policy.';
    public static readonly INVALID_PARAMS_OVER_200_PERCENT = 'There is some value over 200%. Please fix this.';

    // group status comment
    public static readonly DUPLICATED_GROUPNAME = 'This group name is already existed. Please select the other name';
    public static readonly NOT_FOUND_GROUP = 'Not found group';
    public static readonly NOT_FOUND_GROUP_MEMBERS = 'Not found group members';
    public static readonly NOT_FOUND_NON_GROUP_MEMBERS = 'Not found non-group members';

    // cover type status comment
    public static readonly DUPLICATED_COVERNAME = 'This cover name is already existed. Please select the other name';
    public static readonly NOT_FOUND_COVERTYPE = 'Not found cover type';

    // duration status comment
    public static readonly NOT_FOUND_DURATION = 'Not found duration';

    // purchase limit status comment
    public static readonly NOT_FOUND_LIMIT = 'Not found limit';

    // pricing status comment
    public static readonly NOT_FOUND_PRICING = 'Not found pricing';

    // pricing status comment
    public static readonly NOT_FOUND_SETTING = 'Not found setting';

    // pricing status comment
    public static readonly NOT_FOUND_PERMISSION = 'Not found permission';

    // payment status comment
    public static readonly NOT_FOUND_PAYMENT = 'Not found payment';

    // policy item (covered parts) status comment
    public static readonly NOT_FOUND_POLICY_ITEM = 'Not found policy item';

    // policy item (covered parts) status comment
    public static readonly NOT_FOUND_SCHEDULE = 'Not found schedule';

    // refund item status comment
    public static readonly NOT_FOUND_REFUND = 'Not found refund';

    // pricing exception item status comment
    public static readonly NOT_FOUND_EXCEPTION = 'Not found pricing exception';

    // admin charge item status comment
    public static readonly NOT_FOUND_CHARGE = 'Not found admin charge';

    // policy status comment
    public static readonly NOT_FOUND_POLICY = 'Not found policy';

    // state status comment
    public static readonly NOT_FOUND_STATE = 'Not found state';

    // vehicle status comment
    public static readonly NOT_FOUND_VEHICLE = 'Not found vehicle';

    // guarantee status comment
    public static readonly NOT_FOUND_GUARANTEE = 'Not found guarantee';

    // claim status comment
    public static readonly NOT_FOUND_CLAIM = 'Not found claim';
    public static readonly FAILED_SAVE_CLAIMHISTORY = 'Failed to save the claim history';

    // invoice status comment
    public static readonly NOT_FOUND_INVOICE = 'Not found invoice';

    // custom pricing status comment
    public static readonly NOT_FOUND_CUSTOM_PRICING = 'Not found custom pricing';

    // fuel type status comment
    public static readonly NOT_FOUND_FUELTYPE = 'Not found fueltype';

    // claim parts status comment
    public static readonly NOT_FOUND_CLAIMPARTS = 'Not found claim parts';

    // claim labour status comment
    public static readonly NOT_FOUND_CLAIMLABOUR = 'Not found claim labour';

}

export class StaticVariables {
    // max limit count for all list
    public static readonly MAX_LIMIT = 500;
}
