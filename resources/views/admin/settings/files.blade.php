{{-- resources/views/admin/dashboard.blade.php --}}

@extends('adminlte::page')

@section('title', 'Files Manager')

@section('content_header')
    <h1>Files Manager</h1>
@stop

@section('content')
    <iframe src="/laravel-filemanager" style="width: 100%; height: 500px; overflow: hidden; border: none;"></iframe>
@stop


@section('css')

    <!-- Latest compiled and minified CSS -->
@stop

@section('js')

@stop