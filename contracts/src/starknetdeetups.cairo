#[starknet::interface]
trait IStarknetDeetup<T> {
    fn attend(ref self: T) -> ByteArray;
    fn not_attend(ref self: T) -> ByteArray;
    fn get_name(self: @T) -> felt252;
    fn get_time(self: @T) -> felt252;
    fn get_description(self: @T) -> ByteArray;
    fn is_closed(self: @T) -> bool;
    fn get_detail(self: @T) -> (felt252, felt252, ByteArray, ByteArray, bool);
}

#[starknet::contract]
mod StarknetDeetup {
    use super::IStarknetDeetup;
    use serde::Serde;
    use traits::Into;
    use traits::TryInto;
    use array::ArrayTrait;
    use zeroable::Zeroable;
    use option::OptionTrait;
    use starknet::ClassHash;
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use starknet::event::EventEmitter;
    use starknet::storage::Map;
    use starknet::storage_access::StorageBaseAddress;

    #[storage]
    struct Storage {
        name: felt252,
        time_at: felt252,
        description: ByteArray,
        owner: ByteArray,
        is_closed: bool,
        attendees: Map::<ContractAddress, bool>,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        name: felt252,
        time_at: felt252,
        description: ByteArray,
        owner: ByteArray,
    ) {
        self.name.write(name);
        self.time_at.write(time_at);
        self.description.write(description);
        self.owner.write(owner);
        self.is_closed.write(false);
    }

    #[event]
    fn rsvpAttempt(from: ContractAddress) {}

    #[event]
    fn rsvped(from: ContractAddress) {}

    #[event]
    fn unrsvped(from: ContractAddress) {}

    #[event]
    fn eventUpdated(from: ContractAddress) {}

    #[event]
    fn eventClosed(from: ContractAddress) {}

    #[abi(embed_v0)]
    impl IStarknetDeetupImpl of super::IStarknetDeetup<ContractState> {
        fn attend(ref self: ContractState) -> ByteArray {
            let address = get_caller_address();
            let rsvped = self.attendees.read(address);
            rsvpAttempt(address);

            if (rsvped) {
                return "Event already rsvped";
            }

            self.attendees.write(address, true);
            rsvped(address);

            "Event rsvped successful"
        }

        fn not_attend(ref self: ContractState) -> ByteArray {
            let address = get_caller_address();
            let rsvped = self.attendees.read(address);
            rsvpAttempt(address);

            if (!rsvped) {
                return "Event already unrsvped";
            }

            self.attendees.write(address, false);
            unrsvped(address);

            "Event unrsvped successful"
        }

        fn get_name(self: @ContractState) -> felt252 {
            self.name.read()
        }

        fn get_time(self: @ContractState) -> felt252 {
            self.time_at.read()
        }

        fn get_description(self: @ContractState) -> ByteArray {
            self.description.read()
        }

        fn is_closed(self: @ContractState) -> bool {
            self.is_closed.read()
        }

        fn get_detail(self: @ContractState) -> (felt252, felt252, ByteArray, ByteArray, bool) {
            let name = self.name.read();
            let time_at = self.time_at.read();
            let description = self.description.read();
            let owner = self.owner.read();
            let is_closed = self.is_closed.read();

            (name, time_at, description, owner, is_closed)
        }
    }
}
