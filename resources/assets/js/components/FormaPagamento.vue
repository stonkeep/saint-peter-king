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
            <!--CPF CNPJ-->
            <div class="form-group" :class="{ 'has-error': form.errors.has('cpf_cnpj') }">
                <label for="cpf_cnpj" class="col-md-3 control-label">CPF/CNPJ: </label>
                <div class="col-md-6">
                    <the-mask v-model="form.cpf_cnpj" type="CNPJ" name="cpf_cnpj" id="cpf_cnpj"
                              class="form-control" :mask="['###.###.###-##', '##.###.###/####-##']" :masked="false"/>
                        <!--Masked=false passa o valor cru que foi digitado pelo usuário
                        se fosse true passaria o numero com a mascara como valor-->
                    <has-error :form="form" field="cpf_cnpj"></has-error>
                </div>
            </div>

            <!--Telefone-->
            <div class="form-group" :class="{ 'has-error': form.errors.has('telefone') }">
                <label for="telefone" class="col-md-3 control-label">Telefone: </label>
                <div class="col-md-6">
                    <the-mask masked="true" v-model="form.telefone" type="telefone" name="telefone" id="telefone"
                              class="form-control" :mask="['(##) ####-####', '(##) #####-####']" :masked="false"/>
                    <has-error :form="form" field="telefone"></has-error>
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
                    id: this.cliente.id,
                    cpf_cnpj: this.cliente.cpf_cnpj,
                    nome: this.cliente.nome,
                    telefone: this.cliente.telefone,
                })
            }
        },
        props: ['cliente'],
        mounted() {
            console.log('Component mounted.');
        },
        methods: {
            submit () {
                // Submit the form via a POST request
                let location = window.location.href;
                if (location.indexOf("edit") > -1) {
                    console.log(this.form.id);
                    this.form.put('/admin/clientes/'+ this.form.id)
                        .then(({data}) => {
                            window.location.href = '/admin/clientes'
                        })
                } else {
                    this.form.post('/admin/clientes')
                        .then(({data}) => {
                            window.location.href = '/admin/clientes'
                        })
                }

            },
        }
    }
</script>
