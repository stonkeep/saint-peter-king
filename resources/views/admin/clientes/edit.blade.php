
@extends('adminlte::page')

@section('title', 'Premio')

@section('content_header')
    <h1>Premio</h1>
@stop

@section('content')

    @include('admin.layouts.erros')
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <div id="app">
        {{--Cliente.vue--}}
        <cliente :cliente="{{$cliente}}"></cliente>
    </div>

@stop


@section('css')
    <link rel="stylesheet" href="/css/app.css">
@stop

@section('js')
    <!-- Scripts -->
    <script src="/js/manifest.js"></script>
    <script src="/js/vendor.js"></script>
    <script src="/js/app.js"></script>
@stop