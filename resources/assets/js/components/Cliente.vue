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
                    <has-error :form="form" field="nome"></has-error>
                </div>
            </div>
            <!--Descrição-->
            <div class="form-group" :class="{ 'has-error': form.errors.has('cpf_cnpj') }">
                <label for="cpf_cnpj" class="col-md-3 control-label">CPF/CNPJ: </label>
                <div class="col-md-6">
                    <textarea v-model="form.cpf_cnpj" type="text" name="cpf_cnpj" id="cpf_cnpj"
                           class="form-control">
                    </textarea>
                    <has-error :form="form" field="descricao"></has-error>
                </div>
            </div>

            <!--Peso Unitário-->
            <div class="form-group" :class="{ 'has-error': form.errors.has('telefone') }">
                <label for="telefone" class="col-md-3 control-label">Telefone: </label>
                <div class="col-md-6">
                    <input v-model="form.telefone" type="number" name="telefone" id="telefone"
                              class="form-control">
                    <has-error :form="form" field="telefone"></has-error>
                </div>
            </div>

            <!--Preço Unitário-->
            <div class="form-group" :class="{ 'has-error': form.errors.has('preco_unitario') }">
                <label for="preco_unitario" class="col-md-3 control-label">Preço Unitário: </label>
                <div class="col-md-6">
                    <input v-model="form.preco_unitario" type="number" name="preco_unitario" id="preco_unitario"
                           class="form-control">
                    <has-error :form="form" field="preco_unitario"></has-error>
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
                    cpf_cnpj: this.produto.cpf_cnpj,
                    nome: this.produto.nome,
                    telefone: this.produto.telefone,
                    preco_unitario: this.produto.preco_unitario,
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
