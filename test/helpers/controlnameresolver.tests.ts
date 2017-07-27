import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { ControlNameResolver } from '../../src/helpers/ControlNameResolver'

@suite('ControlNameResolver Tests')
export class HelperTests {
    @test
    public 'ControlNameResolver should return Null if control is null'() {
        const name = ControlNameResolver.getNameForControl(null as any);
        expect(name).to.be.eq(null);
    }

    @test
    public 'ControlNameResolver should return Null if control doesn\'t have a name'() {
        const name = ControlNameResolver.getNameForControl({} as any);
        expect(name).to.be.eq(null);
    }

    @test
    public 'ControlNameResolver should return Null if control name is empty'() {
        const name = ControlNameResolver.getNameForControl({ name: '' } as any);
        expect(name).to.be.eq(null);
    }
}

