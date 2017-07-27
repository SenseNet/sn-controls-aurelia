import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { Icon } from '../../src/fieldcontrols';
import { FieldControlBaseTest } from './fieldcontrol-base.tests';

@suite('DumpField component')
export class IconTests extends FieldControlBaseTest<Icon> {

    constructor() {
        super(Icon, 'icon');
    }

    @test
    public async 'Can be constructed'() {
        const viewModel = await this.createFieldViewModel();
        expect(viewModel).to.be.instanceof(Icon);
    }

}