<template>
    <div class="container">
        <form @submit.prevent="submit" @keydown="form.errors.clear($event.target.name)" class="form-horizontal">
            <alert-error :form="form"></alert-error>

            <!--impressaoDeComprovante-->
            <div class="form-group" :class="{ 'has-error': form.errors.has('impressaoDeComprovante') }">
                <label for="impressaoDeComprovante" class="col-md-3 control-label">Comprovante: </label>
                <div class="col-md-6">
                    <!--Usa componente switches em vez de checkbox-->
                    <switches  v-model="form.impressaoDeComprovante"
                               color="blue"
                               text-enabled="Sim"
                               text-disabled="Não"
                               name="impressaoDeComprovante" id="impressaoDeComprovante"
                           class="">
                    </switches>
                    <has-error :form="form" field="impressaoDeComprovante"></has-error>
                </div>
            </div>
            <!--NF-->
            <div class="form-group" :class="{ 'has-error': form.errors.has('NF') }">
                <label for="NF" class="col-md-3 control-label">NF: </label>
                <div class="col-md-6">
                    <input v-model="form.NF" type="number" name="NF" id="NF"
                           class="form-control">
                    <has-error :form="form" field="NF"></has-error>
                </div>
            </div>

            <!--Tipo de Entrega-->
            <div class="form-group" :class="{ 'has-error': form.errors.has('tipoEntrega') }">
                <label for="tipoEntrega" class="col-md-3 control-label">Tipo de Entrega: </label>
                <div class="col-md-6">
                    <select v-model="form.tipoEntrega"  name="tipoEntrega" id="tipoEntrega" class="form-control">
                        <option v-for="entrega in entregas" v-bind:value="entrega.id">
                            {{ entrega.descricao }}
                        </option>
                    </select>
                    <has-error :form="form" field="tipoEntrega"></has-error>
                </div>
            </div>

            <!--Forma de Pagamento-->
            <div class="form-group" :class="{ 'has-error': form.errors.has('formaPagamento') }">
                <label for="formaPagamento" class="col-md-3 control-label">Forma de pagamento: </label>
                <div class="col-md-6">
                    <select v-model="form.formaPagamento"  name="formaPagamento" id="formaPagamento" class="form-control">
                        <option v-for="forma in formaspagamentos" v-bind:value="forma.id">
                            {{ forma.descricao }}
                        </option>
                    </select>
                    <has-error :form="form" field="formaPagamento"></has-error>
                </div>
            </div>

            <!--status-->
            <div class="form-group" :class="{ 'has-error': form.errors.has('status') }">
                <label for="status" class="col-md-3 control-label">status: </label>
                <div class="col-md-6">

                    <select v-model="form.status"  name="status" id="status" class="form-control">
                        <option v-for="statu in status" :value="statu.id"
                                :selected="statu.id == form.status ? 'selected' : ''">
                            {{ statu.descricao }}
                        </option>
                    </select>
                    <has-error :form="form" field="status"></has-error>
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
    import Switches from 'vue-switches';
    export default {
        components: {
            Switches
        },
        data() {
            return {
                // Create a new form instance
                form: new Form({
                    id: this.pedido.id,
                    impressaoDeComprovante: this.pedido.impressaoDeComprovante,
                    NF: this.pedido.NF,
                    tipoEntrega: this.pedido.tipo_entrega_id,
                    formaPagamento: this.pedido.forma_pagamento_id,
                    status: this.pedido.status_id,
                })
            }
        },
        props: ['pedido','status', 'entregas', 'formaspagamentos'],
        mounted() {
            console.log('Component mounted.');
        },
        methods: {
            submit () {
                let location = window.location.href;
                //Verifica se tem a palavra edit no endereço , se sim faz o update
                if (location.indexOf("edit") > -1) {
                    // Submit the form via a PUT(UPDATE) request
                    this.form.put('/admin/pedidos/'+ this.form.id)
                        .then((response) => {
                            if (this.form.successful===true)
                                window.location.href = '/admin/pedidos'
                        })
                } else {
                    // Submit the form via a POST request
                    this.form.post('/admin/pedidos')
                        .then((response) => {
                        if (this.form.successful===true && response.data.id){
                                                            console.log(this.form);
//                            window.location.href = '/admin/pedidos'
                            };
                        })
                }

            },
        }
    }
</script>
