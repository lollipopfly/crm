<?php

namespace App\Http\Requests;

use App\Http\Requests\Request;

class RoutesCreateRequest extends Request
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
     * Custom error messages
     */
    public function messages()
    {
        return [
           'user_id.required' => 'The user field is required!.',
        ];
    }


    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
          'user_id' => 'required',
          'date' => 'required'
        ];
    }
}
