<template>
    <div class="container">
        <form @submit.prevent="submit" @keydown="form.errors.clear($event.target.name)" class="form-horizontal">
            <alert-error :form="form"></alert-error>

            <!--Nome-->
            <div class="form-group" :class="{ 'has-error': form.errors.has('nome') }">
                <label for="nome" class="col-md-3 control-label">Nome: </label>
                <div class="col-md-6">
                    <input v-model="form.nome" type="text" name="nome" id="nome"
                           class="form-control">
                    <has-error :form="form" field="descricao"></has-error>
                </div>
            </div>
            <!--Descrição-->
            <div class="form-group" :class="{ 'has-error': form.errors.has('descricao') }">
                <label for="descricao" class="col-md-3 control-label">Descrição: </label>
                <div class="col-md-6">
                    <textarea v-model="form.descricao" type="text" name="descricao" id="descricao"
                           class="form-control">
                    </textarea>
                    <has-error :form="form" field="descricao"></has-error>
                </div>
            </div>

            <!--Peso Unitário-->
            <div class="form-group" :class="{ 'has-error': form.errors.has('pesoUnitario') }">
                <label for="pesoUnitario" class="col-md-3 control-label">Peso Unitário: </label>
                <div class="col-md-6">
                    <input v-model="form.pesoUnitario" type="number" name="pesoUnitario" id="pesoUnitario"
                              class="form-control">
                    <has-error :form="form" field="pesoUnitario"></has-error>
                </div>
            </div>

            <!--Preço Unitário-->
            <div class="form-group" :class="{ 'has-error': form.errors.has('precoUnitario') }">
                <label for="precoUnitario" class="col-md-3 control-label">Preço Unitário: </label>
                <div class="col-md-6">
                    <input v-model="form.precoUnitario" type="number" name="precoUnitario" id="precoUnitario"
                           class="form-control">
                    <has-error :form="form" field="precoUnitario"></has-error>
                </div>
            </div>

            <!--Submit-->
            <div class="form-group">
                <button :disabled="form.busy" type="submit" class="btn btn-primary" name="enviar">Enviar</button>
            </div>

        </form>
    </div>
</template>

<script>
    import {Form, HasError, AlertError} from 'vform'
    export default {
        data() {
            return {
                // Create a new form instance
                form: new Form({
                    id: this.produto.id,
                    descricao: this.produto.descricao,
                    nome: this.produto.nome,
                    pesoUnitario: this.produto.pesoUnitario,
                    precoUnitario: this.produto.precoUnitario,
                })
            }
        },
        props: ['produto'],
        mounted() {
            console.log('Component mounted.');
        },
        methods: {
            submit () {
                // Submit the form via a POST request
                let location = window.location.href;
                if (location.indexOf("edit") > -1) {
                    console.log(this.form.id);
                    this.form.put('/admin/produtos/'+ this.form.id)
                        .then(({data}) => {
                            window.location.href = '/admin/produtos'
                        })
                } else {
                    this.form.post('/admin/produtos')
                        .then(({data}) => {
                            window.location.href = '/admin/produtos'
                        })
                }

            },
        }
    }
</script>
