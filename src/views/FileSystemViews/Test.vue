<template>
    <el-tree-select v-model="value" :data="data" multiple show-checkbox default-expand-all/>
</template>
<script>
import { httpService } from '@/utils/httpService'


export default {
    data() {
        return {
            value: [1051,2200],
            data: [
                {
                    value: '1051',
                    label: 'Level one 1',
                    children: [
                        {
                            value: '1-1',
                            label: 'Level two 1-1',
                            children: [
                                {
                                    value: '1-1-1',
                                    label: 'Level three 1-1-1',
                                },
                            ],
                        },
                    ],
                },
                {
                    value: '2',
                    label: 'Level one 2',
                    children: [
                        {
                            value: '2-1',
                            label: 'Level two 2-1',
                            children: [
                                {
                                    value: '2-1-1',
                                    label: 'Level three 2-1-1',
                                },
                            ],
                        },
                        {
                            value: '2-2',
                            label: 'Level two 2-2',
                            children: [
                                {
                                    value: '2-2-1',
                                    label: 'Level three 2-2-1',
                                },
                            ],
                        },
                    ],
                },
                {
                    value: '1052',
                    label: 'Level one 3',
                    children: [
                        {
                            value: '2100',
                            label: 'Level two 3-1',
                            children: [
                                {
                                    value: '3-1-1',
                                    label: 'Level three 3-1-1',
                                },
                            ],
                        },
                        {
                            value: '2200',
                            label: 'Level two 3-2',
                            children: [
                                {
                                    value: '3-2-1',
                                    label: 'Level three 3-2-1',
                                },
                            ],
                        },
                    ],
                },
            ]
        }
    }
}
</script>

<style></style>