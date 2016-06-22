<?php

namespace App\Http\Requests;

use App\Http\Requests\Request;

class ProfileUpdateRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'initials' => 'required|unique:users,initials,' . \Auth::user()->id,
            'email' => 'required|email|unique:users,email,'. \Auth::user()->id,
            'phone' => 'unique:users,phone,' . \Auth::user()->id,
        ];
    }
}
